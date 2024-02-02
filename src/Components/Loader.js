import '../Styles/Loader.css';

export default function Loader(props) {
	const { show } = props;
	
	return (show &&
		<div className='loader'>
			<div className='spinner-wrapper'>
				<span className='spinner'></span>
			</div>
		</div>
	)
}