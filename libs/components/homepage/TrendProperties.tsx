import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, IconButton, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopAgentCard from './TopAgentCard';
import { Member } from '../../types/member/member';
import { AgentsInquiry } from '../../types/member/member.input';
import { Property } from '../../types/property/property';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import { PropertiesInquiry } from '../../types/property/property.input';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { REACT_APP_API_URL } from '../../config';
import { userVar } from '../../../apollo/store';
import { Message } from '../../enums/common.enum';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import Link from 'next/link';

interface TrendPropertiesProps {
	initialInput: PropertiesInquiry;
}

const TrendProperties = (props: TrendPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProperties, setTrendProperties] = useState<Property[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	const {
		loading: getProperties,
		data: getPropertiesData,
		error: getAgentPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendProperties(data?.getProperties?.list);
		},
	});
	/** HANDLERS **/
	if (trendProperties) console.log('trendProperties: +++', trendProperties);
	const handleNext = () => {
		if (trendProperties.length > 0) {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % trendProperties.length);
		}
	};

	const handlePrev = () => {
		if (trendProperties.length > 0) {
			setCurrentIndex((prevIndex) => (prevIndex - 1 + trendProperties.length) % trendProperties.length);
		}
	};

	/** HANDLERS **/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// execute likePropertyHandler mutation
			await likeTargetProperty({
				variables: { input: id },
			});

			// execute getPropertiesRefetch
			getPropertiesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err);
			sweetMixinErrorAlert(err.message).then;
		}
	};

	const pushDetailhandler = async (propertyId: string) => {
		console.log('ID;:', propertyId);
		await router.push({ pathname: '/property/detail', query: { id: propertyId } });
	};

	useEffect(() => {
		// Preserve the current index if the properties list changes
		if (trendProperties.length > 0) {
			setCurrentIndex((prevIndex) => {
				const currentPropertyId = trendProperties[prevIndex]?._id;
				const newIndex = trendProperties.findIndex((property) => property._id === currentPropertyId);

				// Return the updated index or default to 0 if not found
				return newIndex >= 0 ? newIndex : 0;
			});
		}
	}, [trendProperties]);

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Hearted by Many</span>
					</Stack>
					<Stack className={'wrapper'}>
						<Box component={'div'} className={'card-wrapper'}>
							<div className="slide">
								{/* Render only the current property */}
								{trendProperties.length > 0 && (
									<div
										className="item"
										key={trendProperties[currentIndex]?._id}
										style={{
											backgroundImage: `url(${REACT_APP_API_URL}/${trendProperties[currentIndex]?.propertyImages[0]})`,
										}}
									>
										<div className={'buttons'}>
											<IconButton color={'default'}>
												<RemoveRedEyeIcon style={{ width: '25px', height: '25px' }} />
											</IconButton>
											<Typography className="view-cnt">{trendProperties[currentIndex]?.propertyViews}</Typography>
										</div>
										<div className="content">
											<div className="name">{trendProperties[currentIndex]?.propertyTitle}</div>
											<div className="des">{trendProperties[currentIndex]?.propertyDesc}</div>
											<button
												onClick={() => {
													pushDetailhandler(trendProperties[currentIndex]?._id);
												}}
											>
												See More
											</button>
										</div>
									</div>
								)}
							</div>
						</Box>

						<div className="button">
							<button className="prev" onClick={handlePrev}>
								<ArrowBackIosNewIcon />
							</button>
							<button className="next" onClick={handleNext}>
								<ArrowForwardIosIcon />
							</button>
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Hearted by Many</span>
							<p>Loved by the Community</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/property'}>
									<span>See All Categories</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Box component={'div'} className={'card-wrapper'}>
							<div className="slide">
								{/* Render only the current property based on currentIndex */}
								{trendProperties.length > 0 && (
									<div
										className="item"
										key={trendProperties[currentIndex]?._id}
										style={{
											backgroundImage: `url(${REACT_APP_API_URL}/${trendProperties[currentIndex]?.propertyImages[0]})`,
										}}
									>
										<div className={'buttons'}>
											<div className="view-like-box">
												<IconButton color={'default'}>
													<RemoveRedEyeIcon style={{ width: '35px', height: '35px', pointerEvents: 'none' }} />
												</IconButton>
												<Typography className="view-cnt">{trendProperties[currentIndex]?.propertyViews}</Typography>
												{/* <IconButton
													color={'default'}
													// onClick={() => likePropertyHandler(user, trendProperties[currentIndex]._id)}
												>
													{trendProperties[currentIndex]?.meLiked?.[0]?.myFavorite ? (
														<FavoriteIcon style={{ width: '35px', height: '35px', pointerEvents: 'none' }} />
													) : (
														<FavoriteIcon />
													)}
												</IconButton>
												<Typography className="view-cnt">{trendProperties[currentIndex]?.propertyLikes}</Typography> */}
											</div>
										</div>
										<div className="content">
											<div className="name">{trendProperties[currentIndex]?.propertyTitle}</div>
											<div className="des">{trendProperties[currentIndex]?.propertyDesc}</div>
											<button
												onClick={() => {
													pushDetailhandler(trendProperties[currentIndex]?._id);
												}}
											>
												See More
											</button>
										</div>
									</div>
								)}
							</div>
						</Box>

						{/* Navigation buttons */}
						<div className="button">
							<button className="prev" onClick={handlePrev}>
								<ArrowBackIosNewIcon />
							</button>
							<button className="next" onClick={handleNext}>
								<ArrowForwardIosIcon />
							</button>
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'propertyLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProperties;
