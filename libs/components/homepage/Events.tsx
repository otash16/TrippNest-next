import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertiesInquiry } from '../../types/property/property.input';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL } from '../../config';
import property from '../../../pages/property';
import { useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { useRouter } from 'next/router';

interface NewPropertiesProps {
	initialInput: PropertiesInquiry;
}

const EventCard = ({ property }: { property: Property }) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const pushDetailhandler = async (propertyId: string) => {
		console.log('ID;:', propertyId);
		await router.push({ pathname: '/property/detail', query: { id: propertyId } });
	};

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack
				className="event-card"
				style={{
					backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
				onClick={() => {
					pushDetailhandler(property._id);
				}}
			>
				<Box component={'div'} className={'info'}>
					<strong>{property?.propertyTitle}</strong>
					<span>{property?.propertyAddress}</span>
				</Box>
				<Box component={'div'} className={'more'}>
					<span>{property?.propertyDesc}</span>
				</Box>
			</Stack>
		);
	}
};

const NewProperties = () => {
	const device = useDeviceDetect();
	const [newProperties, setNewProperties] = useState<Property[]>([]);

	const initialInput = {
		page: 1,
		limit: 4,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	};

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
			setNewProperties(data?.getProperties?.list);
		},
	});

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'white'}>New Relaxing Destinations in Seoul</span>
							<p className={'white'}>Explore the newest spots in Seoul for your perfect getaway!</p>
						</Box>
					</Stack>
					<Stack className={'card-wrapper'}>
						{newProperties.map((property: Property) => {
							return <EventCard property={property} key={property?.propertyTitle} />;
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default NewProperties;
