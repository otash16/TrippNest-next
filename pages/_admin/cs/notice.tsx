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
import { NoticeList } from '../../../libs/components/admin/cs/NoticeList';
import { useMutation, useQuery } from '@apollo/client';
import { GET_NOTICES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { Notice1 } from '../../../libs/types/notice/notice';
import { AllNoticesInquiry } from '../../../libs/types/notice/notice.input';
import { REMOVE_NOTICE_BY_ADMIN, UPDATE_NOTICE_BY_ADMIN } from '../../../apollo/admin/mutation';
import { NoticeCategory, NoticeStatus } from '../../../libs/enums/notice.enum copy';
import { NoticeUpdate } from '../../../libs/types/notice/notice.update';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import router from 'next/router';

const AdminNotice: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [notices, setNotices] = useState<Notice1[]>([]);
	const [noticesInquiry, setNoticesInquiry] = useState<AllNoticesInquiry>(initialInquiry);
	const [properties, setProperties] = useState<Notice1[]>([]);
	const [noticesTotal, setNoticesTotal] = useState<number>(0);
	const [value, setValue] = useState(
		noticesInquiry?.search?.noticeStatus ? noticesInquiry?.search?.noticeStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');
	const [searchText, setSearchText] = useState('');

	/** APOLLO REQUESTS **/
	const [updateNoticeByAdmin] = useMutation(UPDATE_NOTICE_BY_ADMIN);
	const [removeNoticeByAdmin] = useMutation(REMOVE_NOTICE_BY_ADMIN);

	const {
		loading: getNoticesByAdminLoading,
		data: getNoticesByAdminData,
		error: getNoticesByAdminError,
		refetch: getNoticesByAdminRefetch,
	} = useQuery(GET_NOTICES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: initialInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNotices(data?.getAllNoticesByAdmin?.list);
			setNoticesTotal(data?.getAllNoticesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	console.log('notices', notices);

	/** LIFECYCLES **/
	useEffect(() => {
		getNoticesByAdminRefetch({ input: noticesInquiry });
	}, [noticesInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		noticesInquiry.page = newPage + 1;
		await getNoticesByAdminRefetch({ input: noticesInquiry });
		setNoticesInquiry({ ...noticesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		noticesInquiry.limit = parseInt(event.target.value, 10);
		noticesInquiry.page = 1;
		await getNoticesByAdminRefetch({ input: noticesInquiry });
		setNoticesInquiry({ ...noticesInquiry });
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

		setNoticesInquiry({ ...noticesInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeStatus: NoticeStatus.ACTIVE } });
				break;
			case 'BLOCKED':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeStatus: NoticeStatus.BLOCKED } });
				break;
			case 'DELETE':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeStatus: NoticeStatus.DELETE } });
				break;
			default:
				delete noticesInquiry?.search?.noticeStatus;
				setNoticesInquiry({ ...noticesInquiry });
				break;
		}
	};

	const updateNoticeHandler = async (updateData: NoticeUpdate) => {
		try {
			await updateNoticeByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getNoticesByAdminRefetch({ input: noticesInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const removeNoticeHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeNoticeByAdmin({
					variables: {
						input: id,
					},
				});
				getNoticesByAdminRefetch({ input: noticesInquiry });
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
			setNoticesInquiry({
				...noticesInquiry,
				search: {
					...noticesInquiry.search,
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
				setNoticesInquiry({
					...noticesInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...noticesInquiry.search,
						noticeCategory: newValue as NoticeCategory,
					},
				});
			} else {
				delete noticesInquiry?.search?.noticeCategory;
				setNoticesInquiry({ ...noticesInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Box
				component={'div'}
				className={'title flex_space'}
				style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
			>
				<Typography variant={'h2'}>NOTICE Management</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					onClick={() => router.push(`/_admin/cs/notice_create`)}
					style={{ color: '#ffffff' }}
				>
					<AddRoundedIcon sx={{ mr: '8px', color: '#ffffff' }} />
					ADD
				</Button>
			</Box>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Notices List
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
									placeholder="Search notice title"
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
														setNoticesInquiry({
															...noticesInquiry,
															search: {
																...noticesInquiry.search,
																text: '',
															},
														});
														await getNoticesByAdminRefetch({ input: noticesInquiry });
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
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										All
									</MenuItem>
									<MenuItem value={'EVENT'} onClick={() => searchTypeHandler('EVENT')}>
										Event
									</MenuItem>
									<MenuItem value={'TERMS'} onClick={() => searchTypeHandler('TERMS')}>
										Term
									</MenuItem>
									<MenuItem value={'INQUIRY'} onClick={() => searchTypeHandler('INQUIRY')}>
										Inquiry
									</MenuItem>
								</Select>
							</Stack>
							<Divider />
						</Box>
						<NoticeList
							notices={notices}
							// dense={dense}
							// membersData={membersData}
							// searchMembers={searchMembers}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							// generateMentorTypeHandle={generateMentorTypeHandle}
							updateNoticeHandler={updateNoticeHandler}
							removeNoticeHandler={removeNoticeHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={noticesTotal}
							rowsPerPage={noticesInquiry?.limit}
							page={noticesInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminNotice.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		// direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminNotice);
// function removeFaqByAdmin(arg0: { variables: { input: string } }) {
// 	throw new Error('Function not implemented.');
// }
