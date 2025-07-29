import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';
import Link from 'next/link';

const Footer = () => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<Link href={'/'}>
								<img src="/img/logo/logo.jpg" alt="" />
							</Link>
							<Link href={'/'}>
								<div className="logo-text">TripNest</div>
							</Link>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>No-Cost Customer Service</span>
							<p>+998940000556</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Now Live</span>
							<p>+998940000556</p>
							<span>Support?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Search</strong>
								<span>Property for Rent</span>
								<span>Property Low to hide</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span>Seoul</span>
								<span>Gyeongido</span>
								<span>Busan</span>
								<span>Jejudo</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Nestar - All rights reserved. Nestar {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<div className="logo-box">
								<Link href={'/'}>
									<img src="/img/logo/logo.jpg" alt="" />
								</Link>
								<Link href={'/'}>
									<div className="logo-text">TripNest</div>
								</Link>
							</div>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>No-Cost Customer Service</span>
							<p>+998940000556</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Now Live</span>
							<p>+998940000556</p>
							<span>Support?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>Join us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'top'}>
							<strong>Stay informed</strong>
							<div>
								<input type="text" placeholder={'Your Email'} />
								<span>Subscribe</span>
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Top Searches</strong>
								<span>Places for Rent</span>
								<span>Cheapest First</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span>New York</span>
								<span>Los Angeles</span>
								<span>Las Vegas</span>
								<span>Houston</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© TripNest - All rights reserved. TripNest{moment().year()}</span>
					<span>Privacy · Terms · Sitemap</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
