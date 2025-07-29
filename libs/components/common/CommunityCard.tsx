import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	size?: string;
	likeArticleHandler: any;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { boardArticle, size = 'normal', likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent, boardArticle: BoardArticle) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	if (device === 'mobile') {
		return <div>COMMUNITY CARD MOBILE</div>;
	} else {
		return (
			<Stack
				sx={{ width: '640px' }}
				className="community-general-card-config"
				onClick={(e) => chooseArticleHandler(e, boardArticle)}
			>
				<Stack className={'card-wrapper'}>
					<Stack className={'left'}>
						<img className={'card-img'} src={imagePath} alt="" />
						<Stack className={'bottom'}>
							<Stack className="date-box">
								<h5 className="day">
									<Moment format={'DD'}>{boardArticle?.createdAt}</Moment>
								</h5>
								<h6 className="yes">
									<Moment className="month" format={'MMMM'}>
										{boardArticle?.createdAt}
									</Moment>
								</h6>
							</Stack>
							<Stack className={'buttons'}>
								<IconButton
									color={'default'}
									onClick={(e: any) => {
										likeArticleHandler(e, user, boardArticle?._id);
									}}
								>
									{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color={'primary'} />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{boardArticle?.articleLikes}</Typography>
								<IconButton color={'default'}>
									<CommentIcon />
								</IconButton>
								<Typography className="view-cnt">{boardArticle?.articleComments}</Typography>
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{boardArticle?.articleViews}</Typography>
							</Stack>
						</Stack>
					</Stack>
					<Stack className={'right'}>
						<Typography className="title">{boardArticle?.articleTitle}</Typography>
						<Stack
							className="writer-wrapper"
							onClick={(e) => {
								e.stopPropagation();
								goMemberPage(boardArticle?.memberData?._id as string);
							}}
						>
							<img
								className={'write-img'}
								src={
									boardArticle?.memberData?.memberImage
										? `${REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`
										: '/img/profile/defaultUser.svg'
								}
								alt="Writer's profile"
							/>
							<p className="writer-name">{boardArticle?.memberData?.memberNick}</p>
						</Stack>
						<Stack className={'article-content'}>
							<p className="article-desc">{boardArticle?.articleContent}</p>
						</Stack>
						<div className="arrow-wrapper" onClick={(e) => chooseArticleHandler(e, boardArticle)}>
							<IconButton color={'default'}>
								<ArrowForwardIcon style={{ width: '40px', height: '40px', color: 'white' }} />
							</IconButton>
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityCard;
