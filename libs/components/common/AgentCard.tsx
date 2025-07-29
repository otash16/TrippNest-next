import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface AgentCardProps {
	agent: any;
	likeMemberHandler: any;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	// Define the image path logic
	const imagePath: string = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	// Mobile version rendering
	if (device === 'mobile') {
		return <div>AGENT CARD (Mobile View)</div>;
	} else {
		return (
			<Stack className="agent-general-card">
				<Stack className={'agent-card'}>
					<Link
						href={{
							pathname: '/agent/detail',
							query: { agentId: agent?._id },
						}}
					>
						<img className={'agent-img'} src={`${imagePath}`} alt="" />
					</Link>
					<Stack className={'agent-info'}>
						<h2 className="agent-name">{agent?.memberFullName ?? agent?.memberNick}</h2>
						<span className="agent-type">Agent</span>
					</Stack>
					<Stack className={'agent-stats'}>
						<div className="stats-inner">
							<p className="stats-txt">Followers</p>
							<p className="stats-number">{agent?.memberFollowers || 0}</p>
						</div>
						<div className="stats-inner">
							<p className="stats-txt">Properties</p>
							<p className="stats-number">{agent?.memberProperties || 0}</p>
						</div>
						<div className="stats-inner">
							<p className="stats-txt">Articles</p>
							<p className="stats-number">{agent?.memberArticles || 0}</p>
						</div>
					</Stack>
					<Box component={'div'} className={'buttons'}>
						{/* <Button className={'follow-btn'}>Follow me</Button> */}
						<div className="icons-wrapper">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{agent?.memberViews}</Typography>
							<IconButton
								color={'default'}
								onClick={() => {
									likeMemberHandler(user, agent?._id);
								}}
							>
								{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon color={'primary'} />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{agent?.memberLikes}</Typography>
						</div>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default AgentCard;
