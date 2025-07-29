import { Button, Stack, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_NOTIFICATION, GET_NOTIFICATIONS, MARK_ALL_AS_READ } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { useState } from 'react';
import { NotificationsInquiry } from '../../types/notification/notification.input';
import { Notification } from '../../types/notification/notification';
import { NotificationType } from '../../enums/notification.enum';

interface NotificationsProps {
	initialInput: NotificationsInquiry;
}

const NotifacationModal = (props: NotificationsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [total, setTotal] = useState<number>(0);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [limit, setLimit] = useState(initialInput.limit || 4); // Maintain dynamic limit state
	const [showMore, setShowMore] = useState(false);

	// APOLLO-REQUEST
	const [deleteNotification] = useMutation(DELETE_NOTIFICATION);

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
			setNotifications(data?.getUserNotifications?.list);
			setTotal(data?.getUserNotifications?.metaCounter[0].total);
		},
	});

	const [markAllAsRead] = useMutation(MARK_ALL_AS_READ, {
		onCompleted: () => {
			console.log('All notifications marked as READ');
			setNotifications([]); // Clear UI after mutation success
		},
		onError: (error) => console.error('Mutation Error:', error),
	});

	const renderNotificationIcon = (type: NotificationType) => {
		switch (type) {
			case NotificationType.LIKE:
				return <ThumbUpIcon color="primary" />;
			case NotificationType.COMMENT:
				return <ChatBubbleIcon color="secondary" />;
			case NotificationType.FOLLOW:
				return <PersonAddIcon color="secondary" />;
			default:
				return null;
		}
	};

	// Handler to delete all notifications
	const handleMarkAllAsRead = async () => {
		try {
			const result = await markAllAsRead();
			if (result?.data?.markAllNotificationsAsRead) {
				console.log('Notifications successfully updated to READ');
			} else {
				console.error('No notifications were updated');
			}
		} catch (error) {
			console.error('Error executing mutation', error);
		}
	};

	const handleDeleteNotification = async (notificationId: string) => {
		try {
			await deleteNotification({
				variables: { input: notificationId },
			});
			console.log('Notification deleted successfully');
			// Refetch notifications after deletion to refresh UI
			const updatedNotifications = notifications.filter((notification) => notification._id !== notificationId);
			setNotifications(updatedNotifications);
		} catch (error) {
			console.error('Failed to delete notification:', error);
		}
	};

	const handleToggleNotifications = () => {
		if (showMore) {
			// Set back to the initial limit
			setLimit(initialInput.limit || 5);
		} else {
			// Load 4 more notifications
			setLimit((prev) => prev + 5);
		}

		// Toggle between true and false
		setShowMore((prev) => !prev);
		getNotificationsRefetch();
	};

	if (notifications) console.log('notifications: +++', notifications);

	if (device === 'mobile') {
		return <div>Notification Modal(Mobile View)</div>;
	} else {
		return (
			<Stack className={'notification-modal'}>
				<div className="notification-modal-inner">
					<Stack className={'notification-modal-top'}>
						<Typography className={'notification-modal-title'}>Notifications</Typography>
						<Button className={'notification-modal-delete-btn'} onClick={handleMarkAllAsRead}>
							Clear all
						</Button>
					</Stack>
					<Stack className={'notifications-list'}>
						{notifications.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No notifications yet!</p>
							</div>
						) : (
							notifications.map((notification: Notification) => (
								<Stack className={'notification-list-card'} key={notification._id}>
									<div className="notification-list-img">{renderNotificationIcon(notification.notificationType)}</div>
									<p className="notification-list-title">{notification.notificationTitle}</p>
									<Button
										className={'delete-btn'}
										style={{ padding: '0' }}
										onClick={() => handleDeleteNotification(notification._id)}
									>
										<DeleteIcon style={{ padding: '0px' }} />
									</Button>
								</Stack>
							))
						)}
					</Stack>
				</div>
				<Stack className={'notification-modal-btn'} onClick={handleToggleNotifications}>
					{showMore ? 'Show Less' : 'View More'}
				</Stack>
			</Stack>
		);
	}
};

NotifacationModal.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default NotifacationModal;
