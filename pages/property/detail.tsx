import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Checkbox, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import Review from '../../libs/components/property/Review';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import PropertyBigCard from '../../libs/components/common/PropertyBigCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Property } from '../../libs/types/property/property';
import moment from 'moment';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';
import { GET_COMMENTS, GET_PROPERTIES, GET_PROPERTY } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { CREATE_COMMENT, LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PropertyDetail: NextPage = ({ initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [propertyId, setPropertyId] = useState<string | null>(null);
	const [property, setProperty] = useState<Property | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [destinationProperties, setDestinationProperties] = useState<Property[]>([]);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [propertyComments, setPropertyComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.PROPERTY,
		commentContent: '',
		commentRefId: '',
	});

	const [checkInDate, setCheckInDate] = useState<string>('');
	const [checkOutDate, setCheckOutDate] = useState<string>('');
	const [guests, setGuests] = useState<number>(1);
	const [nights, setNights] = useState<number>(0);
	const [totalCost, setTotalCost] = useState<number>(0);

	// Get today's date and tomorrow's date for placeholders
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	// Format dates as yyyy-mm-dd
	const formattedToday = today.toISOString().split('T')[0];
	const formattedTomorrow = tomorrow.toISOString().split('T')[0];

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);
	const [createComment] = useMutation(CREATE_COMMENT);

	const {
		loading: getProperty,
		data: getPropertyData,
		error: getAgentPropertyError,
		refetch: getPropertyRefetch,
	} = useQuery(GET_PROPERTY, {
		fetchPolicy: 'network-only',
		variables: { input: propertyId },
		skip: !propertyId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProperty) setProperty(data?.getProperty);
			if (data?.getProperty) setSlideImage(data?.getProperty?.propertyImages[0]);
		},
	});
	const {
		loading: getProperties,
		data: getPropertiesData,
		error: getAgentPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					locationList: property?.propertyLocation ? [property?.propertyLocation] : [],
				},
			},
		},
		skip: !propertyId && !property,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProperties?.list) setDestinationProperties(data?.getProperties?.list);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getAgentCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialComment },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setPropertyComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	// Set default values for startDate and endDate
	useEffect(() => {
		if (checkInDate && checkOutDate) {
			const checkIn = new Date(checkInDate);
			const checkOut = new Date(checkOutDate);

			// Calculate number of nights
			const diffTime = checkOut.getTime() - checkIn.getTime();
			const numNights = Math.ceil(diffTime / (1000 * 3600 * 24));

			if (numNights > 0) {
				setNights(numNights);
				setTotalCost(numNights * (property?.propertyPrice || 0));
			} else {
				setNights(0);
				setTotalCost(0);
			}
		}
	}, [checkInDate, checkOutDate, property?.propertyPrice]);

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			setPropertyId(router.query.id as string);
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: router.query.id as string,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: router.query.id as string,
			});
		}
	}, [router]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const handleReserveClick = async () => {
		// Show SweetAlert message
		await sweetTopSmallSuccessAlert('Please call to host about reservation!!!', 2000);
		setCheckInDate(''); // Reset check-in date
		setCheckOutDate(''); // Reset check-out date
		setGuests(1);
	};

	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// execute likePropertyHandler mutation

			await likeTargetProperty({
				variables: { input: id },
			});

			// execute getPropertiesRefetch
			await getPropertyRefetch({ input: id });
			getPropertiesRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {
						locationList: [property?.propertyLocation],
					},
				},
			});

			await sweetTopSmallSuccessAlert('seccess', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err);
			sweetMixinErrorAlert(err.message).then;
		}
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await createComment({ variables: { input: insertCommentData } });

			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (device === 'mobile') {
		return <div>PROPERTY DETAIL PAGE</div>;
	} else {
		return (
			<div id={'property-detail-page'}>
				<div className={'container'}>
					<Stack className={'property-detail-config'}>
						<Stack className={'property-info-config'}>
							<Stack className={'info'}>
								<Stack className={'left-box'}>
									<Typography className={'title-main'}>{property?.propertyTitle}</Typography>
									<Stack className={'top-box'}>
										<Typography className={'city'}>{property?.propertyLocation}</Typography>
										<Stack className={'divider'}></Stack>
										<Stack className={'buy-rent-box'}>
											{property?.propertyFamily && (
												<>
													<Stack className={'circle'}>
														<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
															<circle cx="3" cy="3" r="3" fill="#EB6753" />
														</svg>
													</Stack>
													<Typography className={'buy-rent'}>Family</Typography>
												</>
											)}

											{property?.propertySeasonal && (
												<>
													<Stack className={'circle'}>
														<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
															<circle cx="3" cy="3" r="3" fill="#EB6753" />
														</svg>
													</Stack>
													<Typography className={'buy-rent'}>Seasonal</Typography>
												</>
											)}
										</Stack>
										<Stack className={'divider'}></Stack>
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
											<g clipPath="url(#clip0_6505_6282)">
												<path
													d="M7 14C5.61553 14 4.26216 13.5895 3.11101 12.8203C1.95987 12.0511 1.06266 10.9579 0.532846 9.67879C0.00303297 8.3997 -0.13559 6.99224 0.134506 5.63437C0.404603 4.2765 1.07129 3.02922 2.05026 2.05026C3.02922 1.07129 4.2765 0.404603 5.63437 0.134506C6.99224 -0.13559 8.3997 0.00303297 9.67879 0.532846C10.9579 1.06266 12.0511 1.95987 12.8203 3.11101C13.5895 4.26216 14 5.61553 14 7C14 8.85652 13.2625 10.637 11.9498 11.9498C10.637 13.2625 8.85652 14 7 14ZM7 0.931878C5.79984 0.931878 4.62663 1.28777 3.62873 1.95454C2.63084 2.62132 1.85307 3.56903 1.39379 4.67783C0.934505 5.78664 0.814336 7.00673 1.04848 8.18384C1.28262 9.36094 1.86055 10.4422 2.70919 11.2908C3.55783 12.1395 4.63907 12.7174 5.81617 12.9515C6.99327 13.1857 8.21337 13.0655 9.32217 12.6062C10.431 12.1469 11.3787 11.3692 12.0455 10.3713C12.7122 9.37337 13.0681 8.20016 13.0681 7C13.067 5.39099 12.4273 3.84821 11.2895 2.71047C10.1518 1.57273 8.60901 0.933037 7 0.931878Z"
													fill="#181A20"
												/>
												<path
													d="M9.0372 9.7275C8.97153 9.72795 8.90643 9.71543 8.84562 9.69065C8.7848 9.66587 8.72948 9.62933 8.68282 9.58313L6.68345 7.58375C6.63724 7.53709 6.6007 7.48177 6.57592 7.42096C6.55115 7.36015 6.53863 7.29504 6.53907 7.22938V2.7275C6.53907 2.59464 6.59185 2.46723 6.6858 2.37328C6.77974 2.27934 6.90715 2.22656 7.04001 2.22656C7.17287 2.22656 7.30028 2.27934 7.39423 2.37328C7.48817 2.46723 7.54095 2.59464 7.54095 2.7275V7.01937L9.39595 8.87438C9.47462 8.9425 9.53001 9.03354 9.55436 9.13472C9.57871 9.2359 9.5708 9.34217 9.53173 9.43863C9.49266 9.53509 9.4244 9.61691 9.3365 9.67264C9.24861 9.72836 9.14548 9.75519 9.04157 9.74938L9.0372 9.7275Z"
													fill="#181A20"
												/>
											</g>
											<defs>
												<clipPath id="clip0_6505_6282">
													<rect width="14" height="14" fill="white" />
												</clipPath>
											</defs>
										</svg>
										<Typography className={'date'}>{moment().diff(property?.createdAt, 'days')} days ago</Typography>
									</Stack>
									<Stack className={'bottom-box'}>
										<Typography>{property?.propertyAddress} </Typography>
									</Stack>
								</Stack>
								<Stack className={'right-box'}>
									<Stack className="buttons">
										<Stack className="button-box">
											<RemoveRedEyeIcon fontSize="medium" />
											<Typography>{property?.propertyViews}</Typography>
										</Stack>
										<Stack className="button-box">
											{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
												<FavoriteIcon
													color="primary"
													fontSize={'medium'}
													onClick={() => likePropertyHandler(user, property?._id)}
												/>
											) : (
												<FavoriteBorderIcon
													fontSize={'medium'}
													// @ts-ignore
													onClick={() => likePropertyHandler(user, property?._id)}
												/>
											)}
											<Typography>{property?.propertyLikes}</Typography>
										</Stack>
									</Stack>
									<Typography style={{ color: '#4169e1' }}>${formatterStr(property?.propertyPrice)} / night</Typography>
								</Stack>
							</Stack>
							<Stack className={'images'}>
								<div className="wrapper">
									<input type="radio" name="slide" id="one" checked readOnly />
									<input type="radio" name="slide" id="two" />
									<input type="radio" name="slide" id="three" />
									<input type="radio" name="slide" id="four" />
									<div className="img img-1">
										<img src={`${REACT_APP_API_URL}/${property?.propertyImages?.[0]}`} />
									</div>
									<div className="img img-2">
										<img src={`${REACT_APP_API_URL}/${property?.propertyImages?.[1]}`} />
									</div>
									<div className="img img-3">
										<img src={`${REACT_APP_API_URL}/${property?.propertyImages?.[2]}`} />
									</div>
									<div className="img img-4">
										<img src={`${REACT_APP_API_URL}/${property?.propertyImages?.[3]}`} />
									</div>
									<div className="sliders">
										<label htmlFor="one" className="one"></label>
										<label htmlFor="two" className="two"></label>
										<label htmlFor="three" className="three"></label>
										<label htmlFor="four" className="four"></label>
									</div>
								</div>
							</Stack>
						</Stack>
						<Stack className={'property-desc-config'}>
							<Stack className={'left-config'}>
								<Stack className={'options-config'}>
									<Stack className={'option'}>
										<Stack className={'svg-box'}>
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none">
												<path
													d="M21.4883 11.1135L21.4071 11.0524V5.26354C21.4071 4.47769 21.0568 3.72395 20.4331 3.16775C19.8094 2.61155 18.9632 2.29835 18.0803 2.29688H6.09625C5.21335 2.29835 4.36717 2.61155 3.74345 3.16775C3.11973 3.72395 2.76942 4.47769 2.76942 5.26354V11.058L2.68828 11.1135C2.31313 11.4484 2.10218 11.9018 2.10156 12.3747V17.1135C2.10156 17.2712 2.17193 17.4224 2.29717 17.5339C2.42242 17.6454 2.5923 17.708 2.76942 17.708H6.09625C6.20637 17.7077 6.31471 17.6833 6.41163 17.6367C6.50855 17.5902 6.59104 17.5231 6.65176 17.4413L7.78775 15.9302H16.3951L17.531 17.4413C17.5918 17.5231 17.6743 17.5902 17.7712 17.6367C17.8681 17.6833 17.9764 17.7077 18.0866 17.708H21.4134C21.5894 17.7065 21.7577 17.6432 21.8816 17.5319C22.0055 17.4206 22.075 17.2702 22.075 17.1135V12.3747C22.0744 11.9018 21.8634 11.4484 21.4883 11.1135ZM6.09625 3.48576H18.0803C18.61 3.48576 19.1181 3.67306 19.4927 4.00646C19.8672 4.33986 20.0777 4.79205 20.0777 5.26354V8.83576C19.778 8.45662 19.3781 8.14887 18.9134 7.93961C18.4486 7.73035 17.9332 7.62601 17.4125 7.63576H6.76411C6.32701 7.63469 5.894 7.71072 5.4901 7.85948C5.08621 8.00824 4.71944 8.22676 4.41099 8.50243C4.29799 8.60664 4.19369 8.71804 4.09891 8.83576V5.26354C4.09891 4.79205 4.30934 4.33986 4.68392 4.00646C5.05849 3.67306 5.56652 3.48576 6.09625 3.48576ZM19.4098 10.5969H4.76677C4.76677 10.1254 4.9772 9.67319 5.35178 9.3398C5.72635 9.0064 6.23438 8.8191 6.76411 8.8191H17.4125C17.9422 8.8191 18.4502 9.0064 18.8248 9.3398C19.1994 9.67319 19.4098 10.1254 19.4098 10.5969ZM20.7393 16.5247H18.4299L17.3001 15.0024C17.2387 14.9217 17.1559 14.8556 17.059 14.8101C16.9621 14.7646 16.8541 14.741 16.7446 14.7413H7.42573C7.31618 14.741 7.20821 14.7646 7.11133 14.8101C7.01446 14.8556 6.93165 14.9217 6.87022 15.0024L5.74047 16.5191H3.43104V12.3747C3.43104 12.2966 3.44832 12.2193 3.48188 12.1472C3.51545 12.075 3.56464 12.0095 3.62666 11.9543C3.68867 11.8991 3.7623 11.8553 3.84333 11.8255C3.92436 11.7956 4.0112 11.7802 4.09891 11.7802H20.0777C20.2548 11.7802 20.4247 11.8428 20.5499 11.9543C20.6752 12.0658 20.7455 12.217 20.7455 12.3747L20.7393 16.5247Z"
													fill="#181A20"
												/>
											</svg>
										</Stack>
										<Stack className={'option-includes'}>
											<Typography className={'title'}>Bedroom</Typography>
											<Typography className={'option-data'}>{property?.propertyBeds}</Typography>
										</Stack>
									</Stack>
									<Stack className={'option'}>
										<Stack className={'svg-box'}>
											<img src={'/img/icons/bath.svg'} />
										</Stack>
										<Stack className={'option-includes'}>
											<Typography className={'title'}>Bath</Typography>
											<Typography className={'option-data'}>{property?.propertyBath}</Typography>
										</Stack>
									</Stack>
									<Stack className={'option'}>
										<Stack className={'svg-box'}>
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none">
												<path
													d="M20.0464 2.29271H16.7196V1.10938H15.3839V2.29271H8.73021V1.10938H7.39448V2.29271H4.06766C3.53793 2.29271 3.0299 2.48001 2.65532 2.81341C2.28075 3.14681 2.07031 3.59899 2.07031 4.07049V17.1094C2.07031 17.5809 2.28075 18.0331 2.65532 18.3665C3.0299 18.6999 3.53793 18.8872 4.06766 18.8872H20.0464C20.5761 18.8872 21.0842 18.6999 21.4587 18.3665C21.8333 18.0331 22.0438 17.5809 22.0438 17.1094V4.07049C22.0438 3.59899 21.8333 3.14681 21.4587 2.81341C21.0842 2.48001 20.5761 2.29271 20.0464 2.29271ZM4.06766 3.4816H7.39448V4.66493H8.72397V3.4816H15.3839V4.66493H16.7133V3.4816H20.0464C20.2235 3.4816 20.3934 3.54423 20.5187 3.65571C20.6439 3.76719 20.7143 3.91839 20.7143 4.07604V7.03715H3.39979V4.07049C3.40144 3.91379 3.47253 3.76402 3.5976 3.65374C3.72267 3.54346 3.8916 3.48159 4.06766 3.4816ZM20.0464 17.7038H4.06766C3.89053 17.7038 3.72066 17.6412 3.59541 17.5297C3.47016 17.4182 3.39979 17.267 3.39979 17.1094V8.22049H20.7143V17.1094C20.7143 17.267 20.6439 17.4182 20.5187 17.5297C20.3934 17.6412 20.2235 17.7038 20.0464 17.7038Z"
													fill="#181A20"
												/>
												<path
													d="M15.1397 11.8023L13.6042 11.2801L12.5744 10.1412C12.5117 10.0727 12.4327 10.0174 12.3431 9.97949C12.2535 9.94156 12.1555 9.92188 12.0563 9.92188C11.9571 9.92188 11.8591 9.94156 11.7695 9.97949C11.6798 10.0174 11.6009 10.0727 11.5382 10.1412L10.5083 11.2801L8.97289 11.8023C8.88037 11.8343 8.79703 11.8842 8.72892 11.9485C8.66081 12.0127 8.60965 12.0897 8.57916 12.1738C8.54868 12.2578 8.53962 12.3469 8.55267 12.4345C8.56571 12.5221 8.60052 12.606 8.65456 12.6801L9.55961 13.8912L9.64075 15.3523C9.64596 15.4408 9.67332 15.5271 9.72083 15.6049C9.76835 15.6828 9.83482 15.7502 9.91539 15.8023C9.99685 15.8535 10.0898 15.8884 10.1878 15.9047C10.2858 15.921 10.3866 15.9183 10.4834 15.8967L12.0563 15.5245L13.6417 15.9078C13.7387 15.9304 13.8401 15.9332 13.9385 15.9161C14.0369 15.8991 14.1297 15.8625 14.21 15.8091C14.2903 15.7558 14.3562 15.687 14.4026 15.6079C14.449 15.5288 14.4748 15.4414 14.4781 15.3523L14.553 13.8912L15.4518 12.6634C15.5058 12.5893 15.5406 12.5054 15.5537 12.4178C15.5667 12.3302 15.5577 12.2412 15.5272 12.1571C15.4967 12.073 15.4455 11.9961 15.3774 11.9318C15.3093 11.8675 15.226 11.8176 15.1334 11.7856L15.1397 11.8023ZM13.3483 13.3912C13.2844 13.4793 13.2478 13.5808 13.2422 13.6856L13.1923 14.5745L12.2311 14.3412C12.1166 14.3138 11.996 14.3138 11.8815 14.3412L10.9203 14.5745L10.8704 13.6856C10.8648 13.5808 10.8282 13.4793 10.7643 13.3912L10.2212 12.6467L11.1512 12.3301C11.2614 12.2921 11.3584 12.2289 11.4321 12.1467L12.0563 11.4523L12.6805 12.1467C12.7542 12.2289 12.8511 12.2921 12.9613 12.3301L13.8913 12.6467L13.3483 13.3912Z"
													fill="#181A20"
												/>
											</svg>
										</Stack>
										<Stack className={'option-includes'}>
											<Typography className={'title'}>Year Build</Typography>
											<Typography className={'option-data'}>{moment(property?.createdAt).format('YYYY')}</Typography>
										</Stack>
									</Stack>
									<Stack className={'option'}>
										<Stack className={'svg-box'}>
											<img src={'/img/icons/guests.svg'} />
										</Stack>
										<Stack className={'option-includes'}>
											<Typography className={'title'}>Guests</Typography>
											<Typography className={'option-data'}>{property?.propertyGuests} guests</Typography>
										</Stack>
									</Stack>
									<Stack className={'option'}>
										<Stack className={'svg-box'}>
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none">
												<path
													d="M17.2955 18.8863H6.64714C5.76532 18.8848 4.92008 18.5724 4.29654 18.0174C3.673 17.4624 3.32196 16.7101 3.32031 15.9252V7.21961C3.32207 6.73455 3.45794 6.25732 3.71592 5.83005C3.97391 5.40277 4.34608 5.03858 4.7996 4.76961L10.0988 1.6085C10.6506 1.27315 11.3032 1.09375 11.9713 1.09375C12.6394 1.09375 13.292 1.27315 13.8438 1.6085L19.168 4.76961C19.618 5.04048 19.9866 5.4055 20.2412 5.83265C20.4958 6.25981 20.6289 6.73605 20.6285 7.21961V15.9252C20.6269 16.711 20.275 17.4642 19.6501 18.0193C19.0252 18.5745 18.1784 18.8863 17.2955 18.8863ZM11.9713 2.29183C11.5779 2.29281 11.1936 2.39717 10.8665 2.59183L5.53612 5.75294C5.26468 5.91407 5.04189 6.1321 4.88734 6.38784C4.73279 6.64359 4.65122 6.92922 4.64979 7.21961V15.9252C4.64979 16.3967 4.86023 16.8488 5.2348 17.1822C5.60938 17.5156 6.11741 17.7029 6.64714 17.7029H17.2955C17.8252 17.7029 18.3332 17.5156 18.7078 17.1822C19.0824 16.8488 19.2928 16.3967 19.2928 15.9252V7.21961C19.2935 6.92734 19.2129 6.63946 19.0582 6.38163C18.9036 6.12379 18.6797 5.904 18.4065 5.74183L13.0761 2.59183C12.7492 2.39687 12.3648 2.29248 11.9713 2.29183Z"
													fill="#181A20"
												/>
												<path d="M9.30469 14.7422H14.6289V15.9255H9.30469V14.7422Z" fill="#181A20" />
											</svg>
										</Stack>
										<Stack className={'option-includes'}>
											<Typography className={'title'}>Destination Type</Typography>
											<Typography className={'option-data'}>{property?.propertyType}</Typography>
										</Stack>
									</Stack>
								</Stack>
								<Stack className={'agent-config'}>
									<img
										className={'agent-img'}
										src={
											property?.memberData?.memberImage
												? `${REACT_APP_API_URL}/${property?.memberData?.memberImage}`
												: '/img/profile/defaultUser.svg'
										}
										alt=""
									/>
									<div className="agent-content">
										<Link href={`/member?memberId=${property?.memberData?._id}`}>
											<Typography className={'name'}>{property?.memberData?.memberNick}</Typography>
										</Link>
										<div className="agent-wrapper">
											<p className="agent-type">{property?.memberData?.memberType}</p>
											<p className="agent-quality"> - Superhost - </p>
											<p className="agent-year">1 year hosting</p>
										</div>
									</div>
								</Stack>
								<Stack className={'prop-desc-config'}>
									<Stack className={'top'}>
										<Typography className={'title'}>Destination Description</Typography>
										<Typography className={'desc'}>{property?.propertyDesc ?? 'No Description!'}</Typography>
									</Stack>
									<Stack className={'bottom'}>
										<Typography className={'title'}>Destination Details</Typography>
										<Stack className={'info-box'}>
											<Stack className={'left'}>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Price</Typography>
													<Typography className={'data'}>${formatterStr(property?.propertyPrice)} night</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Guests</Typography>
													<Typography className={'data'}>{property?.propertyGuests} guests</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Baths</Typography>
													<Typography className={'data'}>{property?.propertyBath}</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Bedrooms</Typography>
													<Typography className={'data'}>{property?.propertyBeds}</Typography>
												</Box>
											</Stack>
											<Stack className={'right'}>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Year Built</Typography>
													<Typography className={'data'}>{moment(property?.createdAt).format('YYYY')}</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Destination Type</Typography>
													<Typography className={'data'}>{property?.propertyType}</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Destination Options</Typography>
													<Typography className={'data'}>
														For {property?.propertyFamily && 'Family'}{' '}
														{property?.propertySeasonal && 'only specific season'}
													</Typography>
												</Box>
											</Stack>
										</Stack>
									</Stack>
								</Stack>
								{/* <Stack className={'floor-plans-config'}>
									<Typography className={'title'}>Floor Plans</Typography>
									<Stack className={'image-box'}>
										<img src={'/img/property/floorPlan.png'} alt={'image'} />
									</Stack>
								</Stack> */}

								<Stack className={'address-config'}>
									<Typography className={'title'}>Where you will be staying</Typography>
									<Stack className={'map-box'}>
										<iframe
											src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25867.098915951767!2d128.68632810247993!3d35.86402299180927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35660bba427bf179%3A0x1fc02da732b9072f!2sGeumhogangbyeon-ro%2C%20Dong-gu%2C%20Daegu!5e0!3m2!1suz!2skr!4v1695537640704!5m2!1suz!2skr"
											width="100%"
											height="100%"
											style={{ border: 0 }}
											allowFullScreen={true}
											loading="lazy"
											referrerPolicy="no-referrer-when-downgrade"
										></iframe>
									</Stack>
								</Stack>

								<Stack className={'agent-info'}>
									<Typography className={'title'}>Meet your host</Typography>
									<div className="agent-wrapper">
										<div className="right">
											<Link href={`/member?memberId=${property?.memberData?._id}`}>
												<div className="agent-img-wrapper">
													<div className="agent-img-name">
														<img
															className={'agent-img'}
															src={
																property?.memberData?.memberImage
																	? `${REACT_APP_API_URL}/${property?.memberData?.memberImage}`
																	: '/img/profile/defaultUser.svg'
															}
															alt=""
														/>
														<Typography className={'name'}>{property?.memberData?.memberNick}</Typography>
														<p className="agent-type">{property?.memberData?.memberType}</p>
													</div>
													<div className="agent-content">
														<div className="agent-content-inner">
															<h2 className="agent-content-number">{property?.memberData?.memberViews}</h2>
															<p className="agent-content-number">Views</p>
														</div>
														<div className="agent-content-inner">
															<h2 className="agent-content-number">{property?.memberData?.memberFollowers}</h2>
															<p className="agent-content-number">Followers</p>
														</div>
														<div className="agent-content-inner">
															<h2 className="agent-content-number">{property?.memberData?.memberFollowings}</h2>
															<p className="agent-content-number">Followings</p>
														</div>
													</div>
												</div>
											</Link>
										</div>
										<div className="left">
											<div className="agent-inner">
												<div className="agent-name-wrapper">
													<Typography className={'name'}>{property?.memberData?.memberNick}</Typography>
													<p className="agent-phone">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="17"
															height="16"
															viewBox="0 0 17 16"
															fill="none"
														>
															<g clipPath="url(#clip0_6507_6774)">
																<path
																	d="M16.2858 10.11L14.8658 8.69C14.5607 8.39872 14.1551 8.23619 13.7333 8.23619C13.3115 8.23619 12.9059 8.39872 12.6008 8.69L12.1008 9.19C11.7616 9.528 11.3022 9.71778 10.8233 9.71778C10.3444 9.71778 9.88506 9.528 9.54582 9.19C9.16082 8.805 8.91582 8.545 8.67082 8.29C8.42582 8.035 8.17082 7.76 7.77082 7.365C7.43312 7.02661 7.24347 6.56807 7.24347 6.09C7.24347 5.61193 7.43312 5.15339 7.77082 4.815L8.27082 4.315C8.41992 4.16703 8.53822 3.99099 8.61889 3.79703C8.69956 3.60308 8.741 3.39506 8.74082 3.185C8.739 2.76115 8.57012 2.35512 8.27082 2.055L6.85082 0.625C6.44967 0.225577 5.9069 0.000919443 5.34082 0C5.06197 0.000410905 4.78595 0.0558271 4.52855 0.163075C4.27116 0.270322 4.03745 0.427294 3.84082 0.625L2.48582 1.97C1.50938 2.94779 0.960937 4.27315 0.960938 5.655C0.960937 7.03685 1.50938 8.36221 2.48582 9.34C3.26582 10.12 4.15582 11 5.04082 11.92C5.92582 12.84 6.79582 13.7 7.57082 14.5C8.5484 15.4749 9.87269 16.0224 11.2533 16.0224C12.6339 16.0224 13.9582 15.4749 14.9358 14.5L16.2858 13.15C16.6828 12.7513 16.9073 12.2126 16.9108 11.65C16.9157 11.3644 16.8629 11.0808 16.7555 10.8162C16.6481 10.5516 16.4884 10.3114 16.2858 10.11ZM15.5308 12.375L15.3858 12.5L13.9358 11.045C13.8875 10.99 13.8285 10.9455 13.7623 10.9142C13.6961 10.8829 13.6243 10.8655 13.5511 10.8632C13.478 10.8608 13.4051 10.8734 13.337 10.9003C13.269 10.9272 13.2071 10.9678 13.1554 11.0196C13.1036 11.0713 13.0631 11.1332 13.0361 11.2012C13.0092 11.2693 12.9966 11.3421 12.999 11.4153C13.0014 11.4884 13.0187 11.5603 13.05 11.6265C13.0813 11.6927 13.1258 11.7517 13.1808 11.8L14.6558 13.275L14.2058 13.725C13.4279 14.5005 12.3743 14.936 11.2758 14.936C10.1774 14.936 9.12372 14.5005 8.34582 13.725C7.57582 12.955 6.70082 12.065 5.84582 11.175C4.99082 10.285 4.06582 9.37 3.28582 8.59C2.51028 7.81209 2.0748 6.75845 2.0748 5.66C2.0748 4.56155 2.51028 3.50791 3.28582 2.73L3.73582 2.28L5.16082 3.75C5.26027 3.85277 5.39648 3.91182 5.53948 3.91417C5.68247 3.91651 5.82054 3.86196 5.92332 3.7625C6.02609 3.66304 6.08514 3.52684 6.08748 3.38384C6.08983 3.24084 6.03527 3.10277 5.93582 3L4.43582 1.5L4.58082 1.355C4.67935 1.25487 4.79689 1.17543 4.92654 1.12134C5.05619 1.06725 5.19534 1.03959 5.33582 1.04C5.61927 1.04085 5.89081 1.15414 6.09082 1.355L7.51582 2.8C7.61472 2.8998 7.6704 3.0345 7.67082 3.175C7.67088 3.24462 7.65722 3.31358 7.63062 3.37792C7.60403 3.44226 7.56502 3.50074 7.51582 3.55L7.01582 4.05C6.47844 4.58893 6.17668 5.31894 6.17668 6.08C6.17668 6.84106 6.47844 7.57107 7.01582 8.11C7.43582 8.5 7.66582 8.745 7.93582 9C8.20582 9.255 8.43582 9.53 8.83082 9.92C9.36974 10.4574 10.0998 10.7591 10.8608 10.7591C11.6219 10.7591 12.3519 10.4574 12.8908 9.92L13.3908 9.42C13.4929 9.32366 13.628 9.26999 13.7683 9.26999C13.9087 9.26999 14.0437 9.32366 14.1458 9.42L15.5658 10.84C15.6657 10.9387 15.745 11.0563 15.7991 11.1859C15.8532 11.3155 15.8809 11.4546 15.8808 11.595C15.8782 11.7412 15.8459 11.8853 15.7857 12.0186C15.7255 12.1518 15.6388 12.2714 15.5308 12.37V12.375Z"
																	fill="#181A20"
																/>
															</g>
															<defs>
																<clipPath id="clip0_6507_6774">
																	<rect width="16" height="16" fill="white" transform="translate(0.9375)" />
																</clipPath>
															</defs>
														</svg>
														{property?.memberData?.memberPhone}
													</p>
												</div>
												<div className="agent-desc-wrapper">
													<p className="agent-desc">
														{property?.memberData?.memberDesc
															? property?.memberData?.memberImage
															: 'No description yet No description yet No description yet No description yet No description yet No description yet No description yet No description yet'}
													</p>
												</div>
												<div className="agent-input-wrapper">
													<Stack className={'info-box'}>
														<Typography className={'sub-title'}>Name</Typography>
														<input type={'text'} placeholder={'Enter your name'} />
													</Stack>
													<Stack className={'info-box'}>
														<Typography className={'sub-title'}>Phone</Typography>
														<input type={'text'} placeholder={'Enter your phone'} />
													</Stack>
													<Stack className={'info-box'}>
														<Typography className={'sub-title'}>Email</Typography>
														<input type={'text'} placeholder={'creativelayers088'} />
													</Stack>
													<Stack className={'info-box'}>
														<Typography className={'sub-title'}>Message</Typography>
														<textarea
															placeholder={'Hello, I am interested in \n' + '[Renovated property at  floor]'}
														></textarea>
													</Stack>
													<Stack className={'info-box'}>
														<Button className={'send-message'}>
															<Typography className={'title'}>Send Message</Typography>
														</Button>
													</Stack>
												</div>
											</div>
										</div>
									</div>
								</Stack>

								{commentTotal !== 0 && (
									<Stack className={'reviews-config'}>
										<Stack className={'filter-box'}>
											<Stack className={'review-cnt'}>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
													<g clipPath="url(#clip0_6507_7309)">
														<path
															d="M15.7183 4.60288C15.6171 4.3599 15.3413 4.18787 15.0162 4.16489L10.5822 3.8504L8.82988 0.64527C8.7005 0.409792 8.40612 0.257812 8.07846 0.257812C7.7508 0.257812 7.4563 0.409792 7.32774 0.64527L5.57541 3.8504L1.14072 4.16489C0.815641 4.18832 0.540363 4.36035 0.438643 4.60288C0.337508 4.84586 0.430908 5.11238 0.676772 5.28084L4.02851 7.57692L3.04025 10.9774C2.96794 11.2275 3.09216 11.486 3.35771 11.636C3.50045 11.717 3.66815 11.7575 3.83643 11.7575C3.98105 11.7575 4.12577 11.7274 4.25503 11.667L8.07846 9.88098L11.9012 11.667C12.1816 11.7979 12.5342 11.7859 12.7992 11.636C13.0648 11.486 13.189 11.2275 13.1167 10.9774L12.1284 7.57692L15.4801 5.28084C15.7259 5.11238 15.8194 4.84641 15.7183 4.60288Z"
															fill="#181A20"
														/>
													</g>
													<defs>
														<clipPath id="clip0_6507_7309">
															<rect width="15.36" height="12" fill="white" transform="translate(0.398438)" />
														</clipPath>
													</defs>
												</svg>
												<Typography className={'reviews'}>{commentTotal} reviews</Typography>
											</Stack>
										</Stack>
										<Stack className={'review-list'}>
											{propertyComments?.map((comment: Comment) => {
												return <Review comment={comment} key={comment?._id} />;
											})}
											<Box component={'div'} className={'pagination-box'}>
												<MuiPagination
													page={commentInquiry.page}
													count={Math.ceil(commentTotal / commentInquiry.limit)}
													onChange={commentPaginationChangeHandler}
													shape="circular"
													color="primary"
												/>
											</Box>
										</Stack>
									</Stack>
								)}
								<Stack className={'leave-review-config'}>
									<Typography className={'main-title'}>Leave A Review</Typography>
									<Typography className={'review-title'}>Review</Typography>
									<textarea
										onChange={({ target: { value } }: any) => {
											setInsertCommentData({ ...insertCommentData, commentContent: value });
										}}
										value={insertCommentData.commentContent}
									></textarea>
									<Box className={'submit-btn'} component={'div'}>
										<Button
											className={'submit-review'}
											disabled={insertCommentData.commentContent === '' || user?._id === ''}
											onClick={createCommentHandler}
										>
											<Typography className={'title'}>Submit Review</Typography>
											<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
												<g clipPath="url(#clip0_6975_3642)">
													<path
														d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
														fill="#181A20"
													/>
												</g>
												<defs>
													<clipPath id="clip0_6975_3642">
														<rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
													</clipPath>
												</defs>
											</svg>
										</Button>
									</Box>
								</Stack>
							</Stack>
							<Stack className={'right-config'}>
								<Typography className={'price'}>
									${property?.propertyPrice} <span>/ night</span>
								</Typography>
								<Stack className={'date-wrapper'}>
									<Stack className={'info-box'}>
										<Typography className={'sub-title'}>Check in</Typography>
										<input
											type={'date'}
											value={checkInDate}
											onChange={(e) => setCheckInDate(e.target.value)}
											placeholder={'Checkin date'}
										/>
									</Stack>
									<Stack className={'info-box'}>
										<Typography className={'sub-title'}>Check out</Typography>
										<input
											type={'date'}
											value={checkOutDate}
											onChange={(e) => setCheckOutDate(e.target.value)}
											placeholder={'Checkout date'}
										/>
									</Stack>
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Guests number</Typography>
									<input
										type={'number'}
										value={guests}
										onChange={(e) => setGuests(parseInt(e.target.value, 10))}
										min="1"
										max={property?.propertyGuests}
										placeholder={`Maximum ${property?.propertyGuests}`}
									/>
								</Stack>
								<Typography className={'cost-detail'}>Cost Detail</Typography>
								<div className="total-cost-wrapper">
									<p className="price-txt">
										${property?.propertyPrice} x {nights} nights
									</p>
									<p className="total-price">${(nights * (property?.propertyPrice || 0)).toFixed(2)}</p>
								</div>
								<div className="total-cost-wrapper">
									<p className="price-txt">Service fee</p>
									<p className="service-cost"> ${(0.15 * nights * (property?.propertyPrice || 0)).toFixed(2)}</p>
								</div>
								<div className="total-price-wrapper">
									<p className="total-price-text">Total</p>
									<p className="total-price">
										$
										{(0.15 * nights * (property?.propertyPrice || 0) + nights * (property?.propertyPrice || 0)).toFixed(
											2,
										)}
									</p>
								</div>
								<div className="btn-wrapper">
									<Button className="reservation-btn" onClick={handleReserveClick}>
										Reserve
									</Button>
								</div>
							</Stack>
						</Stack>
						{destinationProperties.length !== 0 && (
							<Stack className={'similar-properties-config'}>
								<Stack className={'title-pagination-box'}>
									<Stack className={'title-box'}>
										<Typography className={'main-title'}>Destination Property</Typography>
										<Typography className={'sub-title'}>Aliquam lacinia diam quis lacus euismod</Typography>
									</Stack>
									<Stack className={'pagination-box'}>
										<WestIcon className={'swiper-similar-prev'} />
										<div className={'swiper-similar-pagination'}></div>
										<EastIcon className={'swiper-similar-next'} />
									</Stack>
								</Stack>
								<Stack className={'cards-box'}>
									<Swiper
										className={'similar-homes-swiper'}
										slidesPerView={'auto'}
										spaceBetween={35}
										modules={[Autoplay, Navigation, Pagination]}
										navigation={{
											nextEl: '.swiper-similar-next',
											prevEl: '.swiper-similar-prev',
										}}
										pagination={{
											el: '.swiper-similar-pagination',
										}}
									>
										{destinationProperties.map((property: Property) => {
											return (
												<SwiperSlide className={'similar-homes-slide'} key={property.propertyTitle}>
													<PropertyBigCard property={property} key={property?._id} />
												</SwiperSlide>
											);
										})}
									</Swiper>
								</Stack>
							</Stack>
						)}
					</Stack>
				</div>
			</div>
		);
	}
};

PropertyDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutFull(PropertyDetail);
