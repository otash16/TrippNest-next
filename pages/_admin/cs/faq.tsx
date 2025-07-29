import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, InputAdornment, Stack } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { FaqArticlesPanelList } from '../../../libs/components/admin/cs/FaqList';
import { Faq1 } from '../../../libs/types/faq/faq';
import { AllFaqsInquiry } from '../../../libs/types/faq/faq.input';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_FAQ_BY_ADMIN, UPDATE_FAQ_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_FAQS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { FaqCategory, FaqStatus } from '../../../libs/enums/faq.enum';
import { FaqUpdate } from '../../../libs/types/faq/faq.update';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import router from 'next/router';

const FaqArticles: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [faqs, setFaqs] = useState<Faq1[]>([]);
	const [faqsInquiry, setFaqsInquiry] = useState<AllFaqsInquiry>(initialInquiry);
	const [faqsTotal, setFaqsTotal] = useState<number>(0);
	const [value, setValue] = useState(faqsInquiry?.search?.faqStatus ? faqsInquiry?.search?.faqStatus : 'ALL');
	const [searchType, setSearchType] = useState('ALL');
	const [searchText, setSearchText] = useState('');

	/** APOLLO REQUESTS **/
	const [updateFaqByAdmin] = useMutation(UPDATE_FAQ_BY_ADMIN);
	const [removeFaqByAdmin] = useMutation(REMOVE_FAQ_BY_ADMIN);

	const {
		loading: getFaqsByAdminLoading,
		data: getFaqsByAdminData,
		error: getFaqsByAdminError,
		refetch: getFaqsByAdminRefetch,
	} = useQuery(GET_FAQS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: initialInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFaqs(data?.getAllFaqs?.list);
			setFaqsTotal(data?.getAllFaqs?.metaCounter[0]?.total ?? 0);
		},
	});

	console.log('faqs', faqs);
	/** LIFECYCLES **/
	useEffect(() => {
		getFaqsByAdminRefetch({ input: faqsInquiry });
	}, [faqsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		faqsInquiry.page = newPage + 1;
		await getFaqsByAdminRefetch({ input: faqsInquiry });
		setFaqsInquiry({ ...faqsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		faqsInquiry.limit = parseInt(event.target.value, 10);
		faqsInquiry.page = 1;
		await getFaqsByAdminRefetch({ input: faqsInquiry });
		setFaqsInquiry({ ...faqsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setFaqsInquiry({ ...faqsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setFaqsInquiry({ ...faqsInquiry, search: { faqStatus: FaqStatus.ACTIVE } });
				break;
			case 'BLOCKED':
				setFaqsInquiry({ ...faqsInquiry, search: { faqStatus: FaqStatus.BLOCKED } });
				break;
			case 'DELETE':
				setFaqsInquiry({ ...faqsInquiry, search: { faqStatus: FaqStatus.DELETE } });
				break;
			default:
				delete faqsInquiry?.search?.faqStatus;
				setFaqsInquiry({ ...faqsInquiry });
				break;
		}
	};

	const updateNoticeHandler = async (updateData: FaqUpdate) => {
		try {
			await updateFaqByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getFaqsByAdminRefetch({ input: faqsInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const removeFaqHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeFaqByAdmin({
					variables: {
						input: id,
					},
				});
				getFaqsByAdminRefetch({ input: faqsInquiry });
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const textHandler = useCallback((value: string) => {
		try {
			setSearchText(value);
		} catch (err: any) {
			console.log('textHandler: ', err.message);
		}
	}, []);

	const searchTextHandler = () => {
		try {
			setFaqsInquiry({
				...faqsInquiry,
				search: {
					...faqsInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setFaqsInquiry({
					...faqsInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...faqsInquiry.search,
						faqCategory: newValue as FaqCategory,
					},
				});
			} else {
				delete faqsInquiry?.search?.faqCategory;
				setFaqsInquiry({ ...faqsInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	return (
		// @ts-ignore

		<Box component={'div'} className={'content'}>
			<Box
				component={'div'}
				className={'title flex_space'}
				style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
			>
				<Typography variant={'h2'}>FAQ Management</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					onClick={() => router.push(`/_admin/cs/faq_create`)}
					style={{ color: '#ffffff' }}
				>
					<AddRoundedIcon sx={{ mr: '8px', color: '#ffffff' }} />
					ADD
				</Button>
			</Box>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				FAQs List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'BLOCKED')}
									value="BLOCKED"
									className={value === 'BLOCKED' ? 'li on' : 'li'}
								>
									Blocked
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Deleted
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<OutlinedInput
									value={searchText}
									onChange={(e: any) => textHandler(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search FAQ title"
									onKeyDown={(event) => {
										if (event.key == 'Enter') searchTextHandler();
									}}
									endAdornment={
										<>
											{searchText && (
												<CancelRoundedIcon
													style={{ cursor: 'pointer' }}
													onClick={async () => {
														setSearchText('');
														setFaqsInquiry({
															...faqsInquiry,
															search: {
																...faqsInquiry.search,
																text: '',
															},
														});
														await getFaqsByAdminRefetch({ input: faqsInquiry });
													}}
												/>
											)}
											<InputAdornment position="end" onClick={() => searchTextHandler()}>
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
								<Select sx={{ width: '160px', ml: '20px' }} value={searchType}>
									<MenuItem value={'PROPERTY'} onClick={() => searchTypeHandler('PROPERTY')}>
										Property
									</MenuItem>
									<MenuItem value={'PAYMENT'} onClick={() => searchTypeHandler('PAYMENT')}>
										Payment
									</MenuItem>
									<MenuItem value={'BUYER'} onClick={() => searchTypeHandler('BUYER')}>
										For Buyers
									</MenuItem>
									<MenuItem value={'AGENTS'} onClick={() => searchTypeHandler('AGENTS')}>
										For Agents
									</MenuItem>
									<MenuItem value={'MEMBERSHIP'} onClick={() => searchTypeHandler('MEMBERSHIP')}>
										Membership
									</MenuItem>
									<MenuItem value={'COMMUNITY'} onClick={() => searchTypeHandler('COMMUNITY')}>
										Cummunity
									</MenuItem>
									<MenuItem value={'OTHER'} onClick={() => searchTypeHandler('OTHER')}>
										Other
									</MenuItem>
								</Select>
							</Stack>
							<Divider />
						</Box>
						<FaqArticlesPanelList
							faqs={faqs}
							// dense={dense}
							// membersData={membersData}
							// searchMembers={searchMembers}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							// generateMentorTypeHandle={generateMentorTypeHandle}
							updateNoticeHandler={updateNoticeHandler}
							removeFaqHandler={removeFaqHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={faqsTotal}
							rowsPerPage={faqsInquiry?.limit}
							page={faqsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

FaqArticles.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		// direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(FaqArticles);
