import { useState } from 'react';
import { NotificationsInquiry } from '../../types/notification/notification.input';
import { useQuery } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface NotificationsProps {
	initialInput: NotificationsInquiry;
}

const NotificationBadge = (props: NotificationsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [total, setTotal] = useState<number>(0);
	const [limit, setLimit] = useState(initialInput.limit || 4); // Maintain dynamic limit state

	const {
		loading: getNotifications,
		data: getNotificationsData,
		error: getNotificationsError,
		refetch: getNotificationsRefetch,
	} = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				...initialInput,
				limit, // Dynamically change limit here
			},
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			// Check if metaCounter exists and has elements before accessing 'total'
			const totalCount = data?.getUserNotifications?.metaCounter?.[0]?.total ?? 0; // Default to 0 if total is not found
			setTotal(totalCount);
		},
	});

	// If the total is 0, we don't render the component
	if (total === 0) {
		return null;
	}

	if (device === 'mobile') {
		return <div>Notification Badge(Mobile View)</div>;
	} else {
		return <div className={'notification-badge'}>{total > 20 ? '20+' : total}</div>;
	}
};

NotificationBadge.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default NotificationBadge;
