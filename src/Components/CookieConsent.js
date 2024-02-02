import { useEffect } from 'react';
import 'vanilla-cookieconsent';
import { DEFAULT_LANG } from '../Utilities/Config';

import 'vanilla-cookieconsent/dist/cookieconsent.css';
import '../Styles/CookieConsent.css';

export default function CookieConsent(props) {

	const { handleCookieDisclaimerAgreed, setLoaderVisible, language } = props;

	useEffect(() => {
		if (language) {
			setLoaderVisible(false);

			const langCode = language['language:code'] || DEFAULT_LANG;
			if (!document.getElementById('cc--main')) {
				window.CookieConsentApi = window.initCookieConsent();
				window.CookieConsentApi.run({
					current_lang: langCode,
					force_consent: true,
					cookie_name: 'consent_choice',
					cookie_expiration: 180,
					gui_options: {
						consent_modal: {
							layout: 'box',
							position: 'middle center',
							transition: 'slide',
							swap_buttons: false
						},
						settings_modal: {
							layout: 'box',
							transition: 'slide'
						}
					},
					onAccept: () => {
						setLoaderVisible(true);
						handleCookieDisclaimerAgreed(true);
					},
					languages: {
						langCode: {
							consent_modal: {
								title: language['cookie:disclaimer:header'],
								description: `
									<p>${language['cookie:disclaimer:description']} <a target="_blank" href="${language['cookie:disclaimer:policy_link:url']}">${language['cookie:disclaimer:policy_link:title']}</a></p>
									<br>
									<p class="link-wrapper"><a data-cc="c-settings" class="cc-link">${language['cookie:disclaimer:button:advanced']}</a></p>
								`,
								primary_btn: {
									text: language['cookie:disclaimer:button:agree'],
									role: 'accept_all' // 'accept_selected' or 'accept_all'
								},
								secondary_btn: {
									text: language['cookie:disclaimer:button:necessary'],
									role: 'accept_necessary' // 'settings' or 'accept_necessary'
								}
							},
							settings_modal: {
								title: language['cookie:disclaimer:advanced:title'],
								save_settings_btn: language['cookie:disclaimer:button:save_services'],
								accept_all_btn: language['cookie:disclaimer:button:agree'],
								reject_all_btn: false,
								close_btn_label: language['cookie:disclaimer:button:close'],
								blocks: [{
									title: '',
									description: `${language['cookie:disclaimer:advanced:description']} <a target="_blank" href="${language['cookie:disclaimer:policy_link:url']}">${language['cookie:disclaimer:policy_link:title']}</a>.`
								}, {
									title: language['cookie:disclaimer:services:mapbox:title'],
									description: language['cookie:disclaimer:services:mapbox:description'],
									toggle: {
										value: 'necessary',
										enabled: true,
										readonly: true
									}
								}]
							}
						},
					}
				});
			}
		}
	}, [language]);

	return null;
}