import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
	Box,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyLocation, PropertyType } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { propertyGuests } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: PropertiesInquiry;
	setSearchFilter: any;
	initialInput: PropertiesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [propertyLocation, setPropertyLocation] = useState<PropertyLocation[]>(Object.values(PropertyLocation));
	const [propertyType, setPropertyType] = useState<PropertyType[]>(Object.values(PropertyType));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);
	const [isFilterVisible, setIsFilterVisible] = useState(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.bathList?.length == 0) {
			delete searchFilter.search.bathList;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.bedsList?.length == 0) {
			delete searchFilter.search.bedsList;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/

	const toggleFilterVisibility = () => {
		setIsFilterVisible(!isFilterVisible); // Toggle visibility
	};

	const closeFilterModal = () => {
		setIsFilterVisible(false); // Hide the modal
	};

	const propertyLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('propertyLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('propertyTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyBathSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.bathList?.includes(number)) {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									bathList: searchFilter?.search?.bathList?.filter((item: Number) => item !== number),
								},
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									bathList: searchFilter?.search?.bathList?.filter((item: Number) => item !== number),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, bathList: [...(searchFilter?.search?.bathList || []), number] },
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, bathList: [...(searchFilter?.search?.bathList || []), number] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.bathList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('propertyRoomSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, propertyRoomSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyGuestHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							guestsRange: { ...searchFilter.search.guestsRange, start: value },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							guestsRange: { ...searchFilter.search.guestsRange, start: value },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							guestsRange: { ...searchFilter.search.guestsRange, end: value },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							guestsRange: { ...searchFilter.search.guestsRange, end: value },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const propertyOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('propertyOptionSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyBedSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.bedsList?.includes(number)) {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									bedsList: searchFilter?.search?.bedsList?.filter((item: Number) => item !== number),
								},
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									bedsList: searchFilter?.search?.bedsList?.filter((item: Number) => item !== number),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, bedsList: [...(searchFilter?.search?.bedsList || []), number] },
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, bedsList: [...(searchFilter?.search?.bedsList || []), number] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.bedsList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('propertyBedSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, propertyBedSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/property?input=${JSON.stringify(initialInput)}`,
				`/property?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>PROPERTIES FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main-wrapper'}>
				<Box component={'div'} className={'input-wrapper'}>
					<OutlinedInput
						value={searchText}
						type={'text'}
						className={'search-input'}
						placeholder={'What are you looking for?'}
						onChange={(e: any) => setSearchText(e.target.value)}
						onKeyDown={(event: any) => {
							if (event.key == 'Enter') {
								setSearchFilter({
									...searchFilter,
									search: { ...searchFilter.search, text: searchText },
								});
							}
						}}
						endAdornment={
							<>
								<CancelRoundedIcon
									style={{ cursor: 'pointer', color: '#f97316' }}
									onClick={() => {
										setSearchText('');
										setSearchFilter({
											...searchFilter,
											search: { ...searchFilter.search, text: '' },
										});
									}}
								/>
							</>
						}
					/>
				</Box>
				<Box component={'div'} className="filter-wrapper" onClick={toggleFilterVisibility}>
					<button className={'filter-btn'}>
						<img className={'filter-icon'} src="/img/icons/filter.svg" alt="" />
						<span>Filters</span>
					</button>
				</Box>
				{/* <div className="product-page-top">
					<div className="top-btn-wrapper">
						<button className={'top-btn'}>
							<img className={'top-btn-icon'} src="/img/icons/propertTypes/parks.svg" alt="" />
							<span className={'top-btn-txt'}>Parks</span>
						</button>
					</div>
					<div className="top-btn-wrapper">
						<button className="top-btn">
							<img className={'top-btn-icon'} src="/img/icons/propertTypes/countryside.svg" alt="" />
							<span className={'top-btn-txt'}>Countryside</span>
						</button>
					</div>
					<div className="top-btn-wrapper">
						<button className="top-btn">
							<img className={'top-btn-icon'} src="/img/icons/propertTypes/hanoks.svg" alt="" />
							<span className={'top-btn-txt'}>Hanok</span>
						</button>
					</div>
					<div className="top-btn-wrapper">
						<button className="top-btn">
							<img className={'top-btn-icon'} src="/img/icons/propertTypes/lake.svg" alt="" />
							<span className={'top-btn-txt'}>Lake</span>
						</button>
					</div>
					<div className="top-btn-wrapper">
						<button className="top-btn">
							<img className={'top-btn-icon'} src="/img/icons/propertTypes/skiing.svg" alt="" />
							<span className={'top-btn-txt'}>Skiing</span>
						</button>
					</div>
					<div className="top-btn-wrapper">
						<button className="top-btn">
							<img className={'top-btn-icon'} src="/img/icons/propertTypes/farms.svg" alt="" />
							<span className={'top-btn-txt'}>Farm</span>
						</button>
					</div>
					<div className="top-btn-wrapper">
						<button className="top-btn">
							<img className={'top-btn-icon'} src="/img/icons/propertTypes/pool.svg" alt="" />
							<span className={'top-btn-txt'}>Pool</span>
						</button>
					</div>
					<div className="top-btn-wrapper">
						<button className="top-btn">
							<img className={'top-btn-icon'} src="/img/icons/propertTypes/camping.svg" alt="" />
							<span className={'top-btn-txt'}>Camping</span>
						</button>
					</div>
					<div className="top-btn-wrapper">
						<button className="top-btn">
							<img className={'top-btn-icon'} src="/img/icons/propertTypes/play.svg" alt="" />
							<span className={'top-btn-txt'}>Play</span>
						</button>
					</div>
					<div className="top-btn-wrapper">
						<button className="top-btn">
							<img className={'top-btn-icon'} src="/img/icons/propertTypes/luxe.svg" alt="" />
							<span className={'top-btn-txt'}>Luxe</span>
						</button>
					</div>
				</div> */}
				<Stack className={'filter-main'} style={{ display: isFilterVisible ? 'block' : 'none' }}>
					<Stack className={'find-your-home'} mb={'40px'}>
						<Stack className={'top-wrapper'}>
							<h2 className={'title-main'}>Find Your Destination</h2>
							<button className="cancel-btn" onClick={closeFilterModal}>
								<img className={'cancel-icon'} src="/img/icons/cancel.svg" alt="Cancel" />
							</button>
						</Stack>
					</Stack>
					<Stack className={'find-your-home'} mb={'30px'}>
						<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
							Location
						</p>
						<Stack className={`property-location`}>
							{propertyLocation.map((location: string) => {
								return (
									<Stack className={'input-box'} key={location}>
										<Checkbox
											id={location}
											className="property-checkbox"
											color="default"
											size="small"
											value={location}
											checked={(searchFilter?.search?.locationList || []).includes(location as PropertyLocation)}
											onChange={propertyLocationSelectHandler}
											readOnly
										/>
										<label className={'location-label'} htmlFor={location} style={{ cursor: 'pointer' }}>
											<Typography className="property-type">{location}</Typography>
										</label>
									</Stack>
								);
							})}
						</Stack>
					</Stack>
					<Stack className={'find-your-home'} mb={'30px'}>
						<Typography className={'title'}>Property Type</Typography>
						<div className="property-type-wrapper">
							{propertyType.map((type: string) => (
								<Stack className={'input-box'} key={type}>
									<Checkbox
										id={type}
										className="property-checkbox"
										color="default"
										size="small"
										value={type}
										onChange={propertyTypeSelectHandler}
										checked={(searchFilter?.search?.typeList || []).includes(type as PropertyType)}
										readOnly
									/>
									<label style={{ cursor: 'pointer' }}>
										<Typography className="property_type" style={{ textTransform: 'lowercase' }}>
											{type}
										</Typography>
									</label>
								</Stack>
							))}
						</div>
					</Stack>
					<Stack className={'find-your-home'} mb={'30px'}>
						<Typography className={'title'}>Baths</Typography>
						<Stack className="button-group">
							<Button
								sx={{
									borderRadius: '12px 0 0 12px',
									border: !searchFilter?.search?.bathList ? '2px solid #f97316' : '1px solid #b9b9b9',
								}}
								onClick={() => propertyBathSelectHandler(0)}
							>
								Any
							</Button>
							<Button
								sx={{
									borderRadius: 0,
									border: searchFilter?.search?.bathList?.includes(1) ? '2px solid #f97316' : '1px solid #b9b9b9',
									borderLeft: searchFilter?.search?.bathList?.includes(1) ? undefined : 'none',
								}}
								onClick={() => propertyBathSelectHandler(1)}
							>
								1
							</Button>
							<Button
								sx={{
									borderRadius: 0,
									border: searchFilter?.search?.bathList?.includes(2) ? '2px solid #f97316' : '1px solid #b9b9b9',
									borderLeft: searchFilter?.search?.bathList?.includes(2) ? undefined : 'none',
								}}
								onClick={() => propertyBathSelectHandler(2)}
							>
								2
							</Button>
							<Button
								sx={{
									borderRadius: 0,
									border: searchFilter?.search?.bathList?.includes(3) ? '2px solid #f97316' : '1px solid #b9b9b9',
									borderLeft: searchFilter?.search?.bathList?.includes(3) ? undefined : 'none',
								}}
								onClick={() => propertyBathSelectHandler(3)}
							>
								3
							</Button>
							<Button
								sx={{
									borderRadius: 0,
									border: searchFilter?.search?.bathList?.includes(4) ? '2px solid #f97316' : '1px solid #b9b9b9',
									borderLeft: searchFilter?.search?.bathList?.includes(4) ? undefined : 'none',
									borderRight: searchFilter?.search?.bathList?.includes(4) ? undefined : 'none',
								}}
								onClick={() => propertyBathSelectHandler(4)}
							>
								4
							</Button>
							<Button
								sx={{
									borderRadius: '0 12px 12px 0',
									border: searchFilter?.search?.bathList?.includes(5) ? '2px solid #f97316' : '1px solid #b9b9b9',
								}}
								onClick={() => propertyBathSelectHandler(5)}
							>
								5+
							</Button>
						</Stack>
					</Stack>
					<Stack className={'find-your-home'} mb={'30px'}>
						<Typography className={'title'}>Bedrooms</Typography>
						<Stack className="button-group">
							<Button
								sx={{
									borderRadius: '12px 0 0 12px',
									border: !searchFilter?.search?.bedsList ? '2px solid #f97316' : '1px solid #b9b9b9',
								}}
								onClick={() => propertyBedSelectHandler(0)}
							>
								Any
							</Button>
							<Button
								sx={{
									borderRadius: 0,
									border: searchFilter?.search?.bedsList?.includes(1) ? '2px solid #f97316' : '1px solid #b9b9b9',
									borderLeft: searchFilter?.search?.bedsList?.includes(1) ? undefined : 'none',
								}}
								onClick={() => propertyBedSelectHandler(1)}
							>
								1
							</Button>
							<Button
								sx={{
									borderRadius: 0,
									border: searchFilter?.search?.bedsList?.includes(2) ? '2px solid #f97316' : '1px solid #b9b9b9',
									borderLeft: searchFilter?.search?.bedsList?.includes(2) ? undefined : 'none',
								}}
								onClick={() => propertyBedSelectHandler(2)}
							>
								2
							</Button>
							<Button
								sx={{
									borderRadius: 0,
									border: searchFilter?.search?.bedsList?.includes(3) ? '2px solid #f97316' : '1px solid #b9b9b9',
									borderLeft: searchFilter?.search?.bedsList?.includes(3) ? undefined : 'none',
								}}
								onClick={() => propertyBedSelectHandler(3)}
							>
								3
							</Button>
							<Button
								sx={{
									borderRadius: 0,
									border: searchFilter?.search?.bedsList?.includes(4) ? '2px solid #f97316' : '1px solid #b9b9b9',
									borderLeft: searchFilter?.search?.bedsList?.includes(4) ? undefined : 'none',
									// borderRight: false ? undefined : 'none',
								}}
								onClick={() => propertyBedSelectHandler(4)}
							>
								4
							</Button>
							<Button
								sx={{
									borderRadius: '0 12px 12px 0',
									border: searchFilter?.search?.bedsList?.includes(5) ? '2px solid #f97316' : '1px solid #b9b9b9',
									borderLeft: searchFilter?.search?.bedsList?.includes(5) ? undefined : 'none',
								}}
								onClick={() => propertyBedSelectHandler(5)}
							>
								5+
							</Button>
						</Stack>
					</Stack>
					<Stack className={'find-your-home'} mb={'30px'}>
						<Typography className={'title'}>Options</Typography>
						<div className="options-wrapper" style={{ display: 'flex', flexDirection: 'row' }}>
							<Stack className={'input-box'}>
								<Checkbox
									id={'Seasonal'}
									className="property-checkbox"
									color="default"
									size="small"
									value={'propertySeasonal'}
									checked={(searchFilter?.search?.options || []).includes('propertySeasonal')}
									onChange={propertyOptionSelectHandler}
									readOnly
								/>
								<label htmlFor={'Seasonal'} style={{ cursor: 'pointer' }}>
									<Typography className="propert-type">Seasonal</Typography>
								</label>
							</Stack>
							<Stack className={'input-box'}>
								<Checkbox
									id={'Family'}
									className="property-checkbox"
									color="default"
									size="small"
									value={'propertyFamily'}
									checked={(searchFilter?.search?.options || []).includes('propertyFamily')}
									onChange={propertyOptionSelectHandler}
									readOnly
								/>
								<label htmlFor={'Family'} style={{ cursor: 'pointer' }}>
									<Typography className="propert-type">Family</Typography>
								</label>
							</Stack>
						</div>
					</Stack>
					<Stack className={'find-your-home'} mb={'30px'}>
						<Typography className={'title'}>Number of Guests</Typography>
						<Stack className="square-year-input">
							<FormControl>
								<InputLabel id="demo-simple-select-label">Min</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={searchFilter?.search?.guestsRange?.start ?? 0}
									label="Min"
									onChange={(e: any) => propertyGuestHandler(e, 'start')}
									MenuProps={MenuProps}
								>
									{propertyGuests.map((square: number) => (
										<MenuItem
											value={square}
											disabled={(searchFilter?.search?.guestsRange?.end || 0) < square}
											key={square}
										>
											{square}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<div className="central-divider"></div>
							<FormControl>
								<InputLabel id="demo-simple-select-label">Max</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={searchFilter?.search?.guestsRange?.end ?? 50}
									label="Max"
									onChange={(e: any) => propertyGuestHandler(e, 'end')}
									MenuProps={MenuProps}
								>
									{propertyGuests.map((square: number) => (
										<MenuItem
											value={square}
											disabled={(searchFilter?.search?.guestsRange?.start || 0) > square}
											key={square}
										>
											{square}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Stack>
					</Stack>
					<Stack className={'find-your-home'}>
						<Typography className={'title'}>Price Range</Typography>
						<Stack className="square-year-input">
							<input
								type="number"
								placeholder="$ min"
								min={0}
								value={searchFilter?.search?.pricesRange?.start ?? 0}
								onChange={(e: any) => {
									if (e.target.value >= 0) {
										propertyPriceHandler(e.target.value, 'start');
									}
								}}
							/>
							<div className="central-divider"></div>
							<input
								type="number"
								placeholder="$ max"
								value={searchFilter?.search?.pricesRange?.end ?? 0}
								onChange={(e: any) => {
									if (e.target.value >= 0) {
										propertyPriceHandler(e.target.value, 'end');
									}
								}}
							/>
						</Stack>
					</Stack>
					<Stack className={'bottom'}>
						<div className="btns-wrapper">
							<Button className={'reset-btn'} onClick={refreshHandler}>
								<span>Reset</span>
								<RefreshIcon />
							</Button>
							<Button className={'search-btn'} onClick={closeFilterModal}>
								<span>Show all</span>
							</Button>
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
