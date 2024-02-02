import React, { useState, useEffect, useRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';

import 'keen-slider/keen-slider.min.css';
import '../Styles/Gallery.css';

export default function Gallery(props) {
	const { storyId, images, handlePopupGallery } = props;

	const prevImages = useRef([]);
	const [loaded, setLoaded] = useState(false);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [loadedSlides, setLoadedSlides] = useState([]);
	const sliderOptions = {
		initial: 0,
		slideChanged(slider) { setCurrentSlide(slider.track.details.rel) },
		animationEnded(slider) { setCurrentSlide(slider.track.details.rel); },
		created() { setLoaded(true); },
	};

	const [sliderRef, instanceRef] = new useKeenSlider(sliderOptions);

	const Arrow = (props) => {
		const disabled = props.disabled ? " arrow--disabled" : ""
		return (
			<svg
				onClick={props.onClick}
				className={`arrow ${props.left ? "arrow--left" : "arrow--right"} ${disabled}`}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
			>
				{props.left && (<path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />)}
				{!props.left && (<path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />)}
			</svg>
		)
	}

	const compareArrays = (a, b) => a.length === b.length && JSON.stringify(a) === JSON.stringify(b);

	// Reset gallery options on change of images
	useEffect(() => {
		if (!compareArrays(images, prevImages.current)) {
			if (instanceRef.current) instanceRef.current.update(sliderOptions, 0);
			setCurrentSlide(0);
			prevImages.current = images;
		}
	}, [images]);

	// Load new slides to the gallery
	useEffect(() => {
		const newLoaded = [...loadedSlides];
		newLoaded[currentSlide] = true;
		setLoadedSlides(newLoaded);
	}, [currentSlide]);

	return (images !== null && images.length > 0 &&
		<div className="gallery">
			<div className="navigation-wrapper">
				<div ref={sliderRef} className="keen-slider">
					{[...images].map((image, index) => {
						return (
							<div key={`image-${storyId}-${index}`} className="keen-slider__slide image-slide lazy__slide">
								<div className="spinner"></div>
								<img alt="Story image" src={loadedSlides[index] ? image.image : ""} onClick={() => handlePopupGallery(true, loadedSlides[index] ? image.image : "")}/>
								<div className="image-title">{loadedSlides[index] ? image.title : ""}</div>
							</div>
						)
					})}
				</div>
				{loaded && // && instanceRef.current && instanceRef.current && instanceRef.current.track.details.slides.length > 1 &&
					<>
						<Arrow
							left
							onClick={(e) => e.stopPropagation() || instanceRef.current?.prev()}
							disabled={currentSlide === 0}
						/>
						<Arrow
							onClick={(e) => e.stopPropagation() || instanceRef.current?.next()}
							disabled={currentSlide === instanceRef.current.track.details.slides.length - 1}
						/>
					</>
				}
			</div>
			{loaded && // && instanceRef.current && instanceRef.current && instanceRef.current.track.details.slides.length > 1 &&
				<div className="dots">
				{[...Array(instanceRef.current.track.details.slides.length).keys(),].map((idx) => {
					return (
					<button
						key={idx}
						onClick={() => {instanceRef.current?.moveToIdx(idx)}}
						className={"dot" + (currentSlide === idx ? " active" : "")}
					></button>
					)
				})}
				</div>
			}
		</div>
	);
}