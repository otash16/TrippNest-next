import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Stack, Typography } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BoardArticlesInquiry } from '../../types/board-article/board-article.input';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { Messages } from '../../config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface BoardArticlesProps {
	initialInput: BoardArticlesInquiry;
}

const BoardArticles = (props: BoardArticlesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: getArticles,
		data: getArticlesData,
		error: getAgentArticlesError,
		refetch: getArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
		},
	});
	/** HANDLERS **/
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
			getArticlesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler:', err);
			sweetMixinErrorAlert(err.message).then;
		}
	};

	if (!boardArticles) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'board-articles'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Hot Topics</span>
					</Stack>
					<Stack className={'card-box'}>
						{boardArticles.map((article: BoardArticle) => {
							return (
								<SwiperSlide key={article._id} className={'board-article-slide'}>
									<CommunityCard article={article} likeArticleHandler={likeArticleHandler} />
								</SwiperSlide>
							);
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'board-articles'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Hot Topics</span>
							<p>Be informed with the hottest articles</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{boardArticles.map((article: BoardArticle) => {
							return (
								<CommunityCard
									key={article._id} // Add the key prop here
									article={article}
									likeArticleHandler={likeArticleHandler}
								/>
							);
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

BoardArticles.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'articleViews',
		direction: 'DESC',
		search: {},
	},
};

export default BoardArticles;
