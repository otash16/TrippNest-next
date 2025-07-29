import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
	Box,
	Checkbox,
	Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import { IconButton, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { NotePencil } from 'phosphor-react';
import { Notice1 } from '../../../types/notice/notice';
import moment from 'moment';
import { NoticeCategory, NoticeStatus } from '../../../enums/notice.enum copy';

type Order = 'asc' | 'desc';

interface Data {
	category: string;
	title: string;
	id: string;
	date: string;
	action: string;
	state: string;
}
interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'Category',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'ID',
	},

	{
		id: 'date',
		numeric: true,
		disablePadding: false,
		label: 'DATE',
	},
	{
		id: 'action',
		numeric: false,
		disablePadding: false,
		label: 'ACTION',
	},
	{
		id: 'state',
		numeric: false,
		disablePadding: false,
		label: 'State',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

interface EnhancedTableToolbarProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const [select, setSelect] = useState('');
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
};

interface NoticeListType {
	notices: Notice1[];
	dense?: boolean;
	membersData?: any;
	searchMembers?: any;
	anchorEl?: any;
	menuIconClickHandler?: any;
	menuIconCloseHandler?: any;
	generateMentorTypeHandle?: any;
	updateNoticeHandler: any;
	removeNoticeHandler: any;
}

export const NoticeList = (props: NoticeListType) => {
	const {
		notices,
		dense,
		membersData,
		searchMembers,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		generateMentorTypeHandle,
		updateNoticeHandler,
		removeNoticeHandler,
	} = props;
	const router = useRouter();

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableToolbar />
					<TableBody>
						{notices?.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{notices?.length !== 0 &&
							notices?.map((notice: Notice1, index: number) => {
								return (
									<TableRow hover key={notice?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{notice.noticeCategory}</TableCell>

										<TableCell align="left" className={'name'}>
											<Stack direction={'row'}>
												<Link href={`/member?memberId=${notice._id}`}>
													<div>{notice.noticeTitle}</div>
												</Link>
											</Stack>
										</TableCell>

										<TableCell align="left">{notice._id}</TableCell>
										<TableCell align="left">{moment(notice.createdAt).format('YYYY-MM-DD')}</TableCell>

										<TableCell align="center">
											<Button
												variant="outlined"
												sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
												onClick={() => removeNoticeHandler(notice._id)}
											>
												<DeleteIcon fontSize="small" />
											</Button>
										</TableCell>

										<TableCell align="center">
											<Button onClick={(e: any) => menuIconClickHandler(e, notice._id)} className={'badge success'}>
												{notice.noticeStatus}
											</Button>

											<Menu
												className={'menu-modal'}
												MenuListProps={{
													'aria-labelledby': 'fade-button',
												}}
												anchorEl={anchorEl[notice._id]}
												open={Boolean(anchorEl[notice._id])}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
												sx={{ p: 1 }}
											>
												{Object.values(NoticeStatus)
													.filter((ele: string) => ele !== notice?.noticeStatus)
													.map((status: string) => (
														<MenuItem
															onClick={() => updateNoticeHandler({ _id: notice._id, noticeStatus: status })}
															key={status}
														>
															<Typography variant={'subtitle1'} component={'span'}>
																{status}
															</Typography>
														</MenuItem>
													))}
											</Menu>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
