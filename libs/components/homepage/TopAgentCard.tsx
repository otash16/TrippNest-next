import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface TopAgentProps {
	agent: Member;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<img src={agentImage} alt="" />

				<strong>{agent?.memberNick}</strong>
				<span>{agent?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<div className="icon-image">
					<div className="icon">
						<img src={agentImage} alt={agent.memberNick} />
					</div>
					<div className="hover-image one">
						<div className="img">
							<img src={agentImage} alt={agent.memberNick} />
						</div>
						<div className="content">
							<div className="details">
								<div className="name">{agent.memberNick}</div>
								<div className="job">{agent.memberType}</div>
							</div>
						</div>
					</div>
				</div>
			</Stack>
		);
	}
};

export default TopAgentCard;
