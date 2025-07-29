import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PropertyBigCard from '../../libs/components/common/PropertyBigCard';
import ReviewCard from '../../libs/components/agent/ReviewCard';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Property } from '../../libs/types/property/property';
import { Member } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { PropertiesInquiry } from '../../libs/types/property/property.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GET_BOARD_ARTICLES, GET_COMMENTS, GET_MEMBER, GET_PROPERTIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import ArticleBigCard from '../../libs/components/common/ArticleBigCard';
import {
	CREATE_COMMENT,
	LIKE_TARGET_BOARD_ARTICLE,
	LIKE_TARGET_PROPERTY,
	SUBSCRIBE,
	UNSUBSCRIBE,
} from '../../apollo/user/mutation';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentDetail: NextPage = ({ initialInput, initialComment, initialArticle, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [agentId, setAgentId] = useState<string | null>(null);
	const [agent, setAgent] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(initialInput);
	const [agentProperties, setAgentProperties] = useState<Property[]>([]);
	const [agentArticles, setAgentArticles] = useState<BoardArticle[]>([]);
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialArticle);
	const [propertyTotal, setPropertyTotal] = useState<number>(0);
	const [articleTotal, setArticleTotal] = useState<number>(0);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [agentComments, setAgentComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});
	const [activeSection, setActiveSection] = useState<'Properties' | 'Articles'>('Properties');
	const { memberId } = router.query;

	/** APOLLO REQUESTS **/
	const [createComment] = useMutation(CREATE_COMMENT);
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getAgentMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: agentId },
		skip: !agentId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgent(data?.getMember);
			setSearchFilter({
				...searchFilter,
				search: {
					memberId: data?.getMember?._id,
				},
			});
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: data?.getMember?._id,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: data?.getMember?._id,
			});
			setSearchCommunity({
				...searchCommunity,
				search: {
					memberId: data?.getMember?._id,
				},
			});
		},
	});

	const {
		loading: getBoardArticlesLoading,
		data: getBoardArticlesData,
		error: getBoardArticlesError,
		refetch: getBoardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		skip: !searchCommunity.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentProperties(data?.getProperties?.list);
			setPropertyTotal(data?.getProperties?.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.agentId) setAgentId(router.query.agentId as string);
	}, [router]);

	useEffect(() => {}, [searchFilter]);
	useEffect(() => {}, [commentInquiry]);

	/** HANDLERS **/
	const handleSectionSwitch = (section: 'Properties' | 'Articles') => {
		setActiveSection(section);
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const propertyPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		setSearchFilter({ ...searchFilter });
	};

	const articlePaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchCommunity.page = value;
		setSearchCommunity({ ...searchCommunity });
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			if (user._id === agentId) throw new Error('Cannot write a review for yourself');
			await createComment({
				variables: {
					input: insertCommentData,
				},
			});
			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const likePropertyHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetProperty({
				variables: {
					input: id,
				},
			});
			await getPropertiesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetErrorHandling(err).then();
			console.log('ERROR, likePropertyHandler:', err.message);
			await sweetMixinErrorAlert(err);
		}
	};

	const likeArticleHandler = async (e: any, user: T, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			// execute likePropertyHandler mutation
			await likeTargetBoardArticle({
				variables: { input: id },
			});

			// execute getPropertiesRefetch
			getBoardArticlesRefetch({ input: searchCommunity });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler:', err);
			sweetMixinErrorAlert(err.message).then;
		}
	};

	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw Error(Messages.error2);
			await subscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Followed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw Error(Messages.error2);
			await unsubscribe({
				variables: {
					input: id,
				},
			});

			await sweetTopSmallSuccessAlert('Unfollowed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	if (device === 'mobile') {
		return <div>AGENT DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'agent-detail-page'}>
				<Stack className={'container'}>
					<Stack className={'agent-wrapper'}>
						<Stack className={'left'}>
							<div
								style={{
									background: `url('/img/banner/header1.svg')`,
									backgroundPosition: 'center',
									backgroundSize: 'cover',
									backgroundRepeat: 'no-repeat',
								}}
								className="img-wrapper"
							>
								<img
									className={'agent-img'}
									src={
										agent?.memberImage ? `${REACT_APP_API_URL}/${agent?.memberImage}` : '/img/profile/defaultUser.svg'
									}
									alt=""
									onClick={() => redirectToMemberPageHandler(agent?._id as string)}
								/>
								<Stack className={'agent-info'}>
									<h2 className="agent-name" onClick={() => redirectToMemberPageHandler(agent?._id as string)}>
										{agent?.memberNick}
									</h2>
									<p className="agent-type">Agent</p>
									<p className="agent-phone">
										<span>{agent?.memberPhone}</span>
									</p>
								</Stack>
							</div>

							<Stack className={'agent-stats'}>
								<div className="agent-stats-inner">
									<p className="agent-stats-number">{agent?.memberFollowers}</p>
									<p className="agent-stats-txt">Followers</p>
								</div>
								<div className="agent-stats-inner">
									<p className="agent-stats-number">{agent?.memberFollowings}</p>
									<p className="agent-stats-txt">Followings</p>
								</div>
								<div className="agent-stats-inner">
									<p className="agent-stats-number">{agent?.memberProperties}</p>
									<p className="agent-stats-txt">Properties</p>
								</div>
								<div className="agent-stats-inner">
									<p className="agent-stats-number">{agent?.memberArticles}</p>
									<p className="agent-stats-txt">Articles</p>
								</div>
							</Stack>
							<Stack className={'agent-desc-wrapper'}>
								<div className="agent-desc">{agent?.memberDesc ? agent?.memberDesc : 'No description yet'}</div>
							</Stack>
						</Stack>
						<Stack className={'right'}>
							<Stack className={'right-top'}>
								<div className="buttons">
									<Button
										className={`right-top-btn ${activeSection === 'Properties' ? 'active' : ''}`}
										onClick={() => handleSectionSwitch('Properties')}
									>
										Properties
									</Button>
									<Button
										className={`right-top-btn ${activeSection === 'Articles' ? 'active' : ''}`}
										onClick={() => handleSectionSwitch('Articles')}
									>
										Articles
									</Button>
								</div>
								<Button onClick={() => redirectToMemberPageHandler(agent?._id as string)} className="follow-btn">
									See more
								</Button>
								{/* <Stack className="follow-button-box">
									{agent?.meFollowed && agent?.meFollowed[0]?.myFollowing ? (
										<>
											<Button
												variant="outlined"
												sx={{ background: '#b9b9b9' }}
												onClick={() => unsubscribeHandler(agent?._id, getMemberRefetch, memberId)}
											>
												Unfollow
											</Button>
											<Typography>Following</Typography>
										</>
									) : (
										<Button
											variant="contained"
											sx={{ background: '#ff5d18', ':hover': { background: '#ff5d18' } }}
											onClick={() => subscribeHandler(agent?._id as string, getMemberRefetch, memberId)}
										>
											Follow
										</Button>
									)}
								</Stack> */}
							</Stack>
							{activeSection === 'Properties' && (
								<Stack className={'agent-properties'}>
									{agentProperties.map((property: Property) => (
										<div className={'wrap-main'} key={property?._id}>
											<PropertyBigCard property={property} likePropertyHandler={likePropertyHandler} />
										</div>
									))}
									{/* Pagination for Properties */}
									<Stack className={'pagination'}>
										{propertyTotal ? (
											<>
												<Stack className="pagination-box">
													<Pagination
														page={searchFilter.page}
														count={Math.ceil(propertyTotal / searchFilter.limit) || 1}
														onChange={propertyPaginationChangeHandler}
														shape="circular"
														color="primary"
													/>
												</Stack>
												<span>
													Total {propertyTotal} propert{propertyTotal > 1 ? 'ies' : 'y'} available
												</span>
											</>
										) : (
											<div className={'no-data'}>
												<img src="/img/icons/icoAlert.svg" alt="" />
												<p>No properties found!</p>
											</div>
										)}
									</Stack>
								</Stack>
							)}
							{activeSection === 'Articles' && (
								<Stack className={'agent-articles'}>
									{agentArticles.map((article: BoardArticle) => {
										return (
											<div className={'wrap-main'} key={article?._id}>
												<ArticleBigCard article={article} key={article?._id} likeArticleHandler={likeArticleHandler} />
											</div>
										);
									})}
									<Stack className={'pagination'}>
										{propertyTotal ? (
											<>
												<Stack className="pagination-box">
													<Pagination
														page={searchFilter.page}
														count={Math.ceil(articleTotal / searchFilter.limit) || 1}
														onChange={propertyPaginationChangeHandler}
														shape="circular"
														color="primary"
													/>
												</Stack>
												<span>Total {agent?.memberArticles} articles available</span>
											</>
										) : (
											<div className={'no-data'}>
												<img src="/img/icons/icoAlert.svg" alt="" />
												<p>No properties found!</p>
											</div>
										)}
									</Stack>
									{/* Pagination for Articles */}
								</Stack>
							)}
						</Stack>
					</Stack>
					<Stack className={'review-box'}>
						<Stack className={'main-intro'}>
							<span>Reviews</span>
							<p>we are glad to see you again</p>
						</Stack>
						{commentTotal !== 0 && (
							<Stack className={'review-wrap'}>
								<Box component={'div'} className={'title-box'}>
									<StarIcon />
									<span>
										{commentTotal} review{commentTotal > 1 ? 's' : ''}
									</span>
								</Box>
								{agentComments?.map((comment: Comment) => {
									return <ReviewCard comment={comment} key={comment?._id} />;
								})}
								<Box component={'div'} className={'pagination-box'}>
									<Pagination
										page={commentInquiry.page}
										count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
										onChange={commentPaginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Box>
							</Stack>
						)}

						<Stack className={'leave-review-config'}>
							<Typography className={'main-title'}>Leave A Review</Typography>
							<Typography className={'review-title'}>Review</Typography>
							<textarea
								onChange={({ target: { value } }: any) => {
									setInsertCommentData({ ...insertCommentData, commentContent: value });
								}}
								value={insertCommentData.commentContent}
							></textarea>
							<Box className={'submit-btn'} component={'div'}>
								<Button
									className={'submit-review'}
									disabled={insertCommentData.commentContent === '' || user?._id === ''}
									onClick={createCommentHandler}
								>
									<Typography className={'title'}>Submit Review</Typography>
									<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
										<g clipPath="url(#clip0_6975_3642)">
											<path
												d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
												fill="#181A20"
											/>
										</g>
										<defs>
											<clipPath id="clip0_6975_3642">
												<rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
											</clipPath>
										</defs>
									</svg>
								</Button>
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

AgentDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		search: {
			memberId: '',
		},
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			commentRefId: '',
		},
	},
	initialArticle: {
		page: 1,
		limit: 8,
		search: {
			memberId: '',
		},
	},
};

export default withLayoutBasic(AgentDetail);
