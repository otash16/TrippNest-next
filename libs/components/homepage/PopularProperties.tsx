import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularPropertyCard from './PopularPropertyCard';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { PropertiesInquiry } from '../../types/property/property.input';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface PopularPropertiesProps {
	initialInput: PropertiesInquiry;
}

const PopularProperties = (props: PopularPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularProperties, setPopularProperties] = useState<Property[]>([]);

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
			setPopularProperties(data?.getProperties?.list);
		},
	});
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

	if (!popularProperties) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular Properties</span>
					</Stack>
					<Swiper
						spaceBetween={16}
						slidesPerView={1.2}
						modules={[Autoplay, Pagination]}
						autoplay={{ delay: 3000 }}
						pagination={{ clickable: true }}
						className="popular-swiper"
					>
						{popularProperties.map((property: Property) => (
							<SwiperSlide key={property._id}>
								<PopularPropertyCard key={property._id} property={property} likePropertyHandler={likePropertyHandler} />
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular destinations</span>
							<p>Most Viewed Rankings</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{popularProperties.map((property: Property) => {
							return (
								<PopularPropertyCard key={property._id} property={property} likePropertyHandler={likePropertyHandler} />
							);
						})}
					</Stack>
					<Box component={'div'} className={'right'}>
						<div className={'more-box'}>
							<Link href={'/property'}>
								<span>Show more</span>
							</Link>
						</div>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

PopularProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'propertyViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularProperties;
