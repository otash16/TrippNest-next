import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';

export interface PropertyUpdate {
	_id: string;
	propertyType?: PropertyType;
	propertyStatus?: PropertyStatus;
	propertyLocation?: PropertyLocation;
	propertyAddress?: string;
	propertyTitle?: string;
	propertyPrice?: number;
	propertyGuests?: number;
	propertyBeds?: number;
	propertyBath?: number;
	propertyImages?: string[];
	propertyDesc?: string;
	propertyFamily?: boolean;
	propertySeasonal?: boolean;
	reservedAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
}
