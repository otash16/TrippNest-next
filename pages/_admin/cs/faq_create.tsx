import React, { useCallback, useState } from 'react';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';

import { useMutation, useQuery } from '@apollo/client';
import { CREATE_FAQ_BY_ADMIN } from '../../../apollo/admin/mutation';
import { T } from '../../../libs/types/common';
import { FaqCategory, FaqStatus } from '../../../libs/enums/faq.enum';
import { sweetConfirmAlert, sweetErrorHandling, sweetMixinSuccessAlert } from '../../../libs/sweetAlert';
import router from 'next/router';
import { Stack } from '@mui/material';

const CreateFaq = ({ initialValues, ...props }: any) => {
	const [insertFaqData, setInsertFaqData] = useState<any>(initialValues);

	// Mutation for creating a FAQ
	const [createFaq] = useMutation(CREATE_FAQ_BY_ADMIN);

	const insertFaqHandler = useCallback(async () => {
		try {
			const result = await createFaq({
				variables: {
					input: insertFaqData,
				},
			});

			await sweetMixinSuccessAlert('This FAQ has been created successfully!');
			await router.push('/_admin/cs/faq');
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	}, [insertFaqData]);

	return (
		<div id="add-faq-page">
			<div className="main-title-box">
				<h1 className={'main-title'}>Create New FAQ</h1>
			</div>
			<div>
				<div className="config">
					<div className="config-column">
						<div className="config-column-inner">
							<h2 className={'input-title'}>Title</h2>
							<input
								type="text"
								className="input"
								placeholder="Question"
								value={insertFaqData.faqTitle}
								onChange={({ target: { value } }) => setInsertFaqData({ ...insertFaqData, faqTitle: value })}
							/>
						</div>

						<div className="config-column-inner">
							<h2 className={'input-title'}>Select Category</h2>
							<select
								className="input"
								value={insertFaqData.faqCategory || 'select'}
								onChange={({ target: { value } }) => setInsertFaqData({ ...insertFaqData, faqCategory: value })}
							>
								<option value="select" disabled>
									Select
								</option>
								{/* Map over FaqCategory enum values */}
								{Object.values(FaqCategory).map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>
					</div>

					<h2 className={'input-title'}>Question Answer</h2>
					<Stack className="config-column">
						<textarea
							name=""
							id=""
							className="answer-content-text"
							placeholder="Write the answer of the question"
							value={insertFaqData.faqContent}
							onChange={({ target: { value } }) => setInsertFaqData({ ...insertFaqData, faqContent: value })}
						></textarea>
					</Stack>
				</div>
			</div>

			<button className={'insert-btn'} onClick={insertFaqHandler}>
				Create FAQ
			</button>
		</div>
	);
};

CreateFaq.defaultProps = {
	initialValues: {
		faqCategory: '',
		faqTitle: '',
		faqContent: '',
	},
};

export default withAdminLayout(CreateFaq);
