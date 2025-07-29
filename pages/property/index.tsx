import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import PropertyCard from '../../libs/components/property/PropertyCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/property/Filter';
import { useRouter } from 'next/router';
import { PropertiesInquiry } from '../../libs/types/property/property.input';
import { Property } from '../../libs/types/property/property';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_PROPERTIES } from '../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { PropertyType } from '../../libs/enums/property.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PropertyList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [properties, setProperties] = useState<Property[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');
	const [selectedType, setSelectedType] = useState<string | null>(null);

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	const {
		loading: getProperties,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProperties(data?.getProperties?.list);
			setTotal(data?.getProperties?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/

	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		// BECKEND REFETCH
		console.log('searchFilter:', searchFilter);
		// getPropertiesRefetch({ input: searchFilter }).then();
	}, [searchFilter]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/property?input=${JSON.stringify(searchFilter)}`,
			`/property?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
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
			getPropertiesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err);
			sweetMixinErrorAlert(err.message).then;
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'propertyPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'propertyPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingTypeHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		const selectedId = e.currentTarget.id; // Get the clicked button's ID
		setSelectedType(selectedId);
		if (selectedId === 'all') {
			// Reset search filter to show all properties without any specific sorting
			setSearchFilter({
				...searchFilter,
				search: { ...searchFilter.search, typeList: [] }, // No type filtering
				direction: Direction.ASC, // Optional: if you still want to keep ascending order
			});
		} else {
			switch (selectedId) {
				case 'park':
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, typeList: [PropertyType.PARKS] },
						direction: Direction.ASC,
					});
					// setFilterSortName('Park');
					break;
				case 'lake':
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, typeList: [PropertyType.LAKE] },
						direction: Direction.ASC,
					});
					// setFilterSortName('Lake');
					break;
				case 'countryside':
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, typeList: [PropertyType.COUNTRYSIDE] },
						direction: Direction.ASC,
					});
					// setFilterSortName('Countryside');
					break;
				case 'hanok':
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, typeList: [PropertyType.HANOKS] },
						direction: Direction.ASC,
					});
					// setFilterSortName('Hanok');
					break;
				case 'pool':
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, typeList: [PropertyType.AMAZING_POOLS] },
						direction: Direction.ASC,
					});
					// setFilterSortName('Pool');
					break;
				case 'camping':
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, typeList: [PropertyType.CAMPING] },
						direction: Direction.ASC,
					});
					// setFilterSortName('Camping');
					break;
				case 'play':
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, typeList: [PropertyType.PLAY] },
						direction: Direction.ASC,
					});
					// setFilterSortName('Play');
					break;
				case 'farm':
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, typeList: [PropertyType.FARMS] },
						direction: Direction.ASC,
					});
					// setFilterSortName('Farm');
					break;
				case 'skiing':
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, typeList: [PropertyType.SKIING] },
						direction: Direction.ASC,
					});
					// setFilterSortName('Skiing');
					break;
				case 'luxe':
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, typeList: [PropertyType.LUXE] },
						direction: Direction.ASC,
					});
					// setFilterSortName('Luxe');
					break;
				default:
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, typeList: [] },
					});
				// setFilterSortName('All Types');
			}
		}

		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <h1>PROPERTIES MOBILE</h1>;
	} else {
		return (
			<div id="property-list-page" style={{ position: 'relative' }}>
				<div className="container">
					<Stack component={'div'} className={'right'}>
						<Box component={'div'} className={'sort'}>
							<span>Sort by</span>
							<div>
								<Button
									onClick={sortingClickHandler}
									endIcon={<KeyboardArrowDownRoundedIcon style={{ width: '20px' }} />}
								>
									{filterSortName}
								</Button>
								<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
									<MenuItem
										onClick={sortingHandler}
										id={'new'}
										disableRipple
										sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
									>
										New
									</MenuItem>
									<MenuItem
										onClick={sortingHandler}
										id={'lowest'}
										disableRipple
										sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
									>
										Lowest Price
									</MenuItem>
									<MenuItem
										onClick={sortingHandler}
										id={'highest'}
										disableRipple
										sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
									>
										Highest Price
									</MenuItem>
								</Menu>
							</div>
						</Box>
					</Stack>
					<div className="product-page-top">
						<div className="top-btn-wrapper">
							<button className="top-btn">
								<img className={'top-btn-icon'} src="/img/icons/propertTypes/all.svg" alt="All" />
								<span
									id={'all'}
									className={`top-btn-txt ${selectedType === 'all' ? 'selected' : ''}`}
									onClick={sortingTypeHandler}
								>
									All
								</span>
							</button>
						</div>
						<div className="top-btn-wrapper">
							<button className={'top-btn'}>
								<img className={'top-btn-icon'} src="/img/icons/propertTypes/parks.svg" alt="" />
								<span
									id={'park'}
									className={`top-btn-txt ${selectedType === 'park' ? 'selected' : ''}`}
									onClick={sortingTypeHandler}
								>
									Park
								</span>
							</button>
						</div>
						<div className="top-btn-wrapper">
							<button className="top-btn">
								<img className={'top-btn-icon'} src="/img/icons/propertTypes/countryside.svg" alt="" />
								<span
									id={'countryside'}
									className={`top-btn-txt ${selectedType === 'countryside' ? 'selected' : ''}`}
									onClick={sortingTypeHandler}
								>
									Countryside
								</span>
							</button>
						</div>
						<div className="top-btn-wrapper">
							<button className="top-btn">
								<img className={'top-btn-icon'} src="/img/icons/propertTypes/hanoks.svg" alt="" />
								<span
									id={'hanok'}
									className={`top-btn-txt ${selectedType === 'hanok' ? 'selected' : ''}`}
									onClick={sortingTypeHandler}
								>
									Hanok
								</span>
							</button>
						</div>
						<div className="top-btn-wrapper">
							<button className="top-btn">
								<img className={'top-btn-icon'} src="/img/icons/propertTypes/lake.svg" alt="" />
								<span
									id={'lake'}
									className={`top-btn-txt ${selectedType === 'lake' ? 'selected' : ''}`}
									onClick={sortingTypeHandler}
								>
									Lake
								</span>
							</button>
						</div>
						<div className="top-btn-wrapper">
							<button className="top-btn">
								<img className={'top-btn-icon'} src="/img/icons/propertTypes/skiing.svg" alt="" />
								<span
									id={'skiing'}
									className={`top-btn-txt ${selectedType === 'skiing' ? 'selected' : ''}`}
									onClick={sortingTypeHandler}
								>
									Skiing
								</span>
							</button>
						</div>
						<div className="top-btn-wrapper">
							<button className="top-btn">
								<img className={'top-btn-icon'} src="/img/icons/propertTypes/farms.svg" alt="" />
								<span
									id={'farm'}
									className={`top-btn-txt ${selectedType === 'farm' ? 'selected' : ''}`}
									onClick={sortingTypeHandler}
								>
									Farm
								</span>
							</button>
						</div>
						<div className="top-btn-wrapper">
							<button className="top-btn">
								<img className={'top-btn-icon'} src="/img/icons/propertTypes/pool.svg" alt="" />
								<span
									id={'pool'}
									className={`top-btn-txt ${selectedType === 'pool' ? 'selected' : ''}`}
									onClick={sortingTypeHandler}
								>
									Pool
								</span>
							</button>
						</div>
						<div className="top-btn-wrapper">
							<button className="top-btn">
								<img className={'top-btn-icon'} src="/img/icons/propertTypes/camping.svg" alt="" />
								<span
									id={'camping'}
									className={`top-btn-txt ${selectedType === 'camping' ? 'selected' : ''}`}
									onClick={sortingTypeHandler}
								>
									Camping
								</span>
							</button>
						</div>
						<div className="top-btn-wrapper">
							<button className="top-btn">
								<img className={'top-btn-icon'} src="/img/icons/propertTypes/play.svg" alt="" />
								<span
									id={'play'}
									className={`top-btn-txt ${selectedType === 'play' ? 'selected' : ''}`}
									onClick={sortingTypeHandler}
								>
									Play
								</span>
							</button>
						</div>
						<div className="top-btn-wrapper">
							<button className="top-btn">
								<img className={'top-btn-icon'} src="/img/icons/propertTypes/luxe.svg" alt="" />
								<span
									id={'luxe'}
									className={`top-btn-txt ${selectedType === 'luxe' ? 'selected' : ''}`}
									onClick={sortingTypeHandler}
								>
									Luxe
								</span>
							</button>
						</div>
					</div>

					<Stack className={'property-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}

							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{properties?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Properties found!</p>
									</div>
								) : (
									properties.map((property: Property) => {
										return (
											<PropertyCard property={property} likePropertyHandler={likePropertyHandler} key={property?._id} />
										);
									})
								)}
							</Stack>
							<Stack className="pagination-config">
								{properties.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{properties.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} propert{total > 1 ? 'ies' : 'y'} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

PropertyList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			guestsRange: {
				start: 0,
				end: 10,
			},
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(PropertyList);
