import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { BoardArticle } from '../../types/board-article/board-article';

interface ArticleBigCardProps {
	article: BoardArticle;
	likeArticleHandler: any;
}

const ArticleBigCard = (props: ArticleBigCardProps) => {
	const { article, likeArticleHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goArticleDetatilPage = (articleId: string) => {
		router.push(`/community/detail?id=${articleId}`);
	};

	if (device === 'mobile') {
		return <div>APARTMEND BIG CARD</div>;
	} else {
		return (
			<Stack className="property-big-card-box" onClick={() => goArticleDetatilPage(article?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${article?.articleImage})` }}
				>
					<div className={'price'}>{article?.articleCategory} </div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{article?.articleTitle}</strong>
					<p className={'desc'}>{article?.articleContent}</p>

					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{article?.articleViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e: any) => {
									e.stopPropagation();
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

export default ArticleBigCard;
