import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Property } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TopPropertyCardProps {
	property: Property;
}

const TopPropertyCard = (props: TopPropertyCardProps) => {
	const { property } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailhandler = async (propertyId: string) => {
		console.log('ID;:', propertyId);
		await router.push({ pathname: '/property/detail', query: { id: propertyId } });
	};
	if (device === 'mobile') {
		return (
			<Stack className="top-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => {
						pushDetailhandler(property._id);
					}}
				>
					<div className={'price'}>${property.propertyPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{property.propertyTitle}</strong>
					<p className={'desc'}>{property.propertyAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{property?.propertyBeds} bed</span>
						</div>
						<div>
							<img src="/img/icons/bath.svg" alt="" />
							<span>{property?.propertyBath} baths</span>
						</div>
						<div>
							<img src="/img/icons/guest.svg" alt="" />
							<span>{property?.propertyGuests} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{' '}
							{property.propertyFamily ? 'Family' : ''} {property.propertyFamily && property.propertySeasonal && '/'}{' '}
							{property.propertySeasonal ? 'Seasonal' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack
				className="top-card-box"
				onClick={() => {
					pushDetailhandler(property._id);
				}}
			>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
				>
					<div className={'status'}>
						<img className={'star-icon'} src="/img/icons/star.svg" alt="" />
					</div>

					{/* <img className={'star-icon'} src="/img/icons/star.svg" alt="" /> */}
					<div className={'price'}>${property.propertyPrice} / night</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{property.propertyTitle}</strong>
					<p className={'desc'}>{property.propertyAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{property?.propertyBeds} bed</span>
						</div>
						<div>
							<img src="/img/icons/bath.svg" alt="" />
							<span>{property?.propertyBath} baths</span>
						</div>
						<div>
							<img src="/img/icons/guests.svg" alt="" />
							<span>{property?.propertyGuests} guests</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{' '}
							{property.propertyFamily ? 'Family' : ''} {property.propertyFamily && property.propertySeasonal && '/'}{' '}
							{property.propertySeasonal ? 'Seasonal' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};
export default TopPropertyCard;
