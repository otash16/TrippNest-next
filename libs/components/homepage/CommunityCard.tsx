import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Divider, Stack, Typography } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface CommunityCardProps {
	article: BoardArticle;
	likeArticleHandler: any;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { article, likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailhandler = async (articleId: string) => {
		console.log('ID;:', articleId);
		await router.push({ pathname: '/community/detail', query: { id: articleId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="article-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${article?.articleImage[0]})` }}
					onClick={() => {
						pushDetailhandler(article._id);
					}}
				>
					<div className="like-btn-wrapper">
						<IconButton
							color={'default'}
							onClick={(e: any) => {
								likeArticleHandler(e, user, article?._id);
							}}
						>
							{article?.meLiked && article?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon style={{ color: 'red' }} />
							) : (
								<FavoriteIcon />
							)}
						</IconButton>
					</div>
				</Box>
				<Box
					component={'div'}
					className={'info'}
					onClick={() => {
						pushDetailhandler(article._id);
					}}
				>
					<strong className={'title'}>{article.articleTitle}</strong>

					<Divider sx={{ mt: '15px', mb: '17px' }} />
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="article-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${article?.articleImage})` }}
					onClick={() => {
						pushDetailhandler(article._id);
					}}
				></Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailhandler(article._id);
						}}
					>
						{article.articleTitle}
					</strong>
					<p className={'desc'}>{article.articleContent ?? 'no content'}</p>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{article.articleCategory}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{article?.articleViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e: any) => {
									likeArticleHandler(e, user, article?._id);
								}}
							>
								{article?.meLiked && article?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{article?.articleLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default CommunityCard;
