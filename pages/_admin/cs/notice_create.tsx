import { useCallback, useState } from 'react';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { CREATE_NOTICE_BY_ADMIN } from '../../../apollo/admin/mutation';
import { useMutation } from '@apollo/client';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../../libs/sweetAlert';
import router from 'next/router';
import { NoticeCategory } from '../../../libs/enums/notice.enum copy';
import { Stack } from '@mui/material';

const CreateNotice = ({ initialValues, ...props }: any) => {
	const [insertNoticeData, setInsertNoticeData] = useState<any>(initialValues);

	// Mutation for creating a FAQ
	const [createNotice] = useMutation(CREATE_NOTICE_BY_ADMIN);

	const insertFaqHandler = useCallback(async () => {
		try {
			const result = await createNotice({
				variables: {
					input: insertNoticeData,
				},
			});

			await sweetMixinSuccessAlert('This NOTICE has been created successfully!');
			await router.push('/_admin/cs/notice');
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	}, [insertNoticeData]);

	return (
		<div id="add-faq-page">
			<div className="main-title-box">
				<h1 className={'main-title'}>Create New Notice</h1>
			</div>
			<div>
				<div className="config">
					<div className="config-column">
						<div className="config-column-inner">
							<h2 className={'input-title'}>Title</h2>
							<input
								type="text"
								className="input"
								placeholder="Notice title"
								value={insertNoticeData.noticeTitle}
								onChange={({ target: { value } }) => setInsertNoticeData({ ...insertNoticeData, noticeTitle: value })}
							/>
						</div>

						<div className="config-column-inner">
							<h2 className={'input-title'}>Select Category</h2>
							<select
								className="input"
								value={insertNoticeData.noticeCategory || 'select'}
								onChange={({ target: { value } }) =>
									setInsertNoticeData({ ...insertNoticeData, noticeCategory: value })
								}
							>
								<option value="select" disabled>
									Select
								</option>
								{/* Map over FaqCategory enum values */}
								{Object.values(NoticeCategory).map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* <h2 className={'input-title'}>Question Answer</h2>
					<Stack className="config-column">
						<textarea
							name=""
							id=""
							className="answer-content-text"
							placeholder="Write the answer of the question"
							value={insertNoticeData.faqContent}
							onChange={({ target: { value } }) => setInsertFaqData({ ...insertFaqData, faqContent: value })}
						></textarea>
					</Stack> */}
				</div>
			</div>

			<button className={'insert-btn'} onClick={insertFaqHandler}>
				Create Notice
			</button>
		</div>
	);
};

CreateNotice.defaultProps = {
	initialValues: {
		noticeCategory: '',
		noticeTitle: '',
	},
};

export default withAdminLayout(CreateNotice);
