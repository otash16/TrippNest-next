import React from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { Faq1 } from '../../../types/faq/faq';
import moment from 'moment';
import { FaqStatus } from '../../../enums/faq.enum';

interface Data {
	category: string;
	title: string;
	id: string;
	date: string;
	action: string;
	state: string;
	content: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

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
		id: 'content',
		numeric: true,
		disablePadding: false,
		label: 'CONTENT',
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

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

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
}

interface FaqArticlesPanelListType {
	faqs: Faq1[];
	dense?: boolean;
	membersData?: any;
	searchMembers?: any;
	anchorEl?: any;
	menuIconClickHandler?: any;
	menuIconCloseHandler?: any;
	generateMentorTypeHandle?: any;
	updateNoticeHandler: any;
	removeFaqHandler: any;
}

export const FaqArticlesPanelList = (props: FaqArticlesPanelListType) => {
	const {
		faqs,
		dense,
		membersData,
		searchMembers,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		generateMentorTypeHandle,
		updateNoticeHandler,
		removeFaqHandler,
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
					<EnhancedTableHead />
					<TableBody>
						{faqs?.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{faqs?.length !== 0 &&
							faqs?.map((faq: Faq1, index: number) => {
								return (
									<TableRow hover key={faq?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left" style={{ color: '#000', fontWeight: '500' }}>
											{faq.faqCategory}
										</TableCell>

										<TableCell align="left" className={'name'}>
											<Stack direction={'row'}>
												<Link href={`/member?memberId=${faq._id}`}>
													<div>{faq.faqTitle}</div>
												</Link>
											</Stack>
										</TableCell>
										<TableCell style={{ width: '400px', height: '65.1px', overflow: 'hidden' }} align="left">
											{faq.faqContent}
										</TableCell>

										<TableCell align="left">{faq._id}</TableCell>
										<TableCell align="left">{moment(faq.createdAt).format('YYYY-MM-DD')}</TableCell>

										<TableCell align="center">
											<Button
												variant="outlined"
												sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
												onClick={() => removeFaqHandler(faq._id)}
											>
												<DeleteIcon fontSize="small" />
											</Button>
										</TableCell>

										<TableCell align="center">
											<Button onClick={(e: any) => menuIconClickHandler(e, faq._id)} className={'badge success'}>
												{faq.faqStatus}
											</Button>

											<Menu
												className={'menu-modal'}
												MenuListProps={{
													'aria-labelledby': 'fade-button',
												}}
												anchorEl={anchorEl[faq._id]}
												open={Boolean(anchorEl[faq._id])}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
												sx={{ p: 1 }}
											>
												{Object.values(FaqStatus)
													.filter((ele: string) => ele !== faq?.faqStatus)
													.map((status: string) => (
														<MenuItem
															onClick={() => updateNoticeHandler({ _id: faq._id, faqStatus: status })}
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
