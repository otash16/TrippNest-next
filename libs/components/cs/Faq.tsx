// import React, { SyntheticEvent, useState } from 'react';
// import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
// import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
// import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
// import { useRouter } from 'next/router';
// import { styled } from '@mui/material/styles';
// import useDeviceDetect from '../../hooks/useDeviceDetect';
// import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
// import { useQuery } from '@apollo/client';
// import { GET_FAQS } from '../../../apollo/user/query';
// import { T } from '../../types/common';
// import { Faq1 } from '../../types/faq/faq';
// import { AllFaqsInquiry } from '../../types/faq/faq.input';
// import { FaqCategory } from '../../enums/faq.enum';

// interface FaqProps {
// 	initialInput: AllFaqsInquiry;
// }

// const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
// 	({ theme }) => ({
// 		border: `1px solid ${theme.palette.divider}`,
// 		'&:not(:last-child)': {
// 			borderBottom: 0,
// 		},
// 		'&:before': {
// 			display: 'none',
// 		},
// 	}),
// );
// const AccordionSummary = styled((props: AccordionSummaryProps) => (
// 	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
// ))(({ theme }) => ({
// 	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
// 	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
// 		transform: 'rotate(180deg)',
// 	},
// 	'& .MuiAccordionSummary-content': {
// 		marginLeft: theme.spacing(1),
// 	},
// }));

// const Faq = (props: FaqProps) => {
// 	const { initialInput } = props;
// 	const device = useDeviceDetect();
// 	const router = useRouter();
// 	const [category, setCategory] = useState<FaqCategory>(FaqCategory.PROPERTY);
// 	const [expanded, setExpanded] = useState<string | false>('panel1');
// 	const [faqs, setFaqs] = useState<Faq1[]>([]);
// 	const [searchFaq, setSearchFaq] = useState<AllFaqsInquiry>(initialInput);

// 	/** APOLLO REQUESTS **/
// 	const {
// 		loading: getFaqsLoading,
// 		data: getFaqsData,
// 		error: getFaqsError,
// 		refetch: getFaqsRefetch,
// 	} = useQuery(GET_FAQS, {
// 		fetchPolicy: 'cache-and-network',
// 		variables: { input: initialInput },
// 		notifyOnNetworkStatusChange: true,
// 		onCompleted: (data: T) => {
// 			setFaqs(data?.getAllFaqs?.list);
// 		},
// 	});
// 	/** LIFECYCLES **/

// 	/** HANDLERS **/

// 	const changeCategoryHandler = (category: FaqCategory) => {
// 		setCategory(category); // Ensure this is a valid FaqCategory value
// 		setSearchFaq({
// 			...searchFaq,
// 			search: {
// 				...searchFaq.search,
// 				faqCategory: category, // Should be a valid FaqCategory value
// 			},
// 		});
// 		getFaqsRefetch(); // Refetch the FAQs
// 	};

// 	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
// 		setExpanded(newExpanded ? panel : false);
// 	};

// 	if (device === 'mobile') {
// 		return <div>FAQ MOBILE</div>;
// 	} else {
// 		return (
// 			<Stack className={'faq-content'}>
// 				<Box className={'categories'} component={'div'}>
// 					<div
// 						className={category === FaqCategory.PROPERTY ? 'active' : ''}
// 						onClick={() => {
// 							changeCategoryHandler(FaqCategory.PROPERTY);
// 						}}
// 					>
// 						PROPERTY
// 					</div>
// 					<div
// 						className={category === FaqCategory.PAYMENT ? 'active' : ''}
// 						onClick={() => {
// 							changeCategoryHandler(FaqCategory.PAYMENT);
// 						}}
// 					>
// 						Payment
// 					</div>
// 					<div
// 						className={category === FaqCategory.BUYER ? 'active' : ''}
// 						onClick={() => {
// 							changeCategoryHandler(FaqCategory.BUYER);
// 						}}
// 					>
// 						Foy Buyers
// 					</div>
// 					<div
// 						className={category === FaqCategory.AGENTS ? 'active' : ''}
// 						onClick={() => {
// 							changeCategoryHandler(FaqCategory.AGENTS);
// 						}}
// 					>
// 						For Agents
// 					</div>
// 					<div
// 						className={category === FaqCategory.MEMBERSHIP ? 'active' : ''}
// 						onClick={() => {
// 							changeCategoryHandler(FaqCategory.MEMBERSHIP);
// 						}}
// 					>
// 						Membership
// 					</div>
// 					<div
// 						className={category === FaqCategory.COMMUNITY ? 'active' : ''}
// 						onClick={() => {
// 							changeCategoryHandler(FaqCategory.COMMUNITY);
// 						}}
// 					>
// 						COMMUNITY
// 					</div>
// 					<div
// 						className={category === FaqCategory.OTHER ? 'active' : ''}
// 						onClick={() => {
// 							changeCategoryHandler(FaqCategory.OTHER);
// 						}}
// 					>
// 						Other
// 					</div>
// 				</Box>
// 				<Box className={'wrap'} component={'div'}>
// 					{faqs &&
// 						faqs.map((faq: Faq1) => (
// 							<Accordion expanded={expanded === faq?._id} onChange={handleChange(faq?._id)} key={faq?.faqTitle}>
// 								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
// 									<Typography className="badge" variant={'h4'}>
// 										Q
// 									</Typography>
// 									<Typography> {faq?.faqTitle}</Typography>
// 								</AccordionSummary>
// 								<AccordionDetails>
// 									<Stack className={'answer flex-box'}>
// 										<Typography className="badge" variant={'h4'} color={'primary'}>
// 											A
// 										</Typography>
// 										<Typography> {faq?.faqContent}</Typography>
// 									</Stack>
// 								</AccordionDetails>
// 							</Accordion>
// 						))}
// 				</Box>
// 			</Stack>
// 		);
// 	}
// };

// Faq.defaultProps = {
// 	initialInput: {
// 		page: 1,
// 		limit: 10,
// 		sort: 'createdAt',
// 		direction: 'DESC',
// 		search: {},
// 	},
// };

// export default Faq;

import React, { SyntheticEvent, useState, useEffect } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useQuery } from '@apollo/client';
import { GET_FAQS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { Faq1 } from '../../types/faq/faq';
import { AllFaqsInquiry } from '../../types/faq/faq.input';
import { FaqCategory } from '../../enums/faq.enum';

interface FaqProps {
	initialInput: AllFaqsInquiry;
}

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = (props: FaqProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<FaqCategory>(FaqCategory.PROPERTY);
	const [expanded, setExpanded] = useState<string | false>('panel1');
	const [faqs, setFaqs] = useState<Faq1[]>([]);
	const [searchFaq, setSearchFaq] = useState<AllFaqsInquiry>(initialInput);

	/** APOLLO REQUESTS **/
	const {
		loading: getFaqsLoading,
		data: getFaqsData,
		error: getFaqsError,
		refetch: getFaqsRefetch,
	} = useQuery(GET_FAQS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFaq }, // Use searchFaq here
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFaqs(data?.getAllFaqs?.list || []);
		},
	});

	/** HANDLERS **/
	const changeCategoryHandler = (category: FaqCategory) => {
		setCategory(category); // Update the selected category
		const updatedSearch = {
			...searchFaq,
			search: {
				...searchFaq.search,
				faqCategory: category, // Ensure the category is correctly passed
			},
		};
		setSearchFaq(updatedSearch); // Update the search parameters
		getFaqsRefetch({ input: updatedSearch }); // Refetch data with updated category
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					{Object.values(FaqCategory).map((cat) => (
						<div key={cat} className={category === cat ? 'active' : ''} onClick={() => changeCategoryHandler(cat)}>
							{cat}
						</div>
					))}
				</Box>
				<Box className={'wrap'} component={'div'}>
					{faqs.map((faq: Faq1) => (
						<Accordion expanded={expanded === faq?._id} onChange={handleChange(faq?._id)} key={faq?.faqTitle}>
							<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
								<Typography className="badge" variant={'h4'}>
									Q
								</Typography>
								<Typography>{faq?.faqTitle}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Stack className={'answer flex-box'}>
									<Typography className="badge" variant={'h4'} color={'primary'}>
										A
									</Typography>
									<Typography>{faq?.faqContent}</Typography>
								</Stack>
							</AccordionDetails>
						</Accordion>
					))}
				</Box>
			</Stack>
		);
	}
};

Faq.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			faqCategory: FaqCategory.PROPERTY, // Default to a valid category
		},
	},
};

export default Faq;
