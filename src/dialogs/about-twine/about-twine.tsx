import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {IconCode} from '@tabler/icons';
import {ButtonBar} from '../../components/container/button-bar';
import {DialogCard} from '../../components/container/dialog-card';
import {IconLink} from '../../components/control/icon-link';
import {getAppInfo} from '../../util/app-info';
import {DialogComponentProps} from '../dialogs.types';
import credits from './credits.json';
import './about-twine.css';

const SOURCE_REPOSITORY_URL = 'https://github.com/infict/infict-editor-twine';

export const AboutTwineDialog: React.FC<DialogComponentProps> = props => {
	const {t} = useTranslation();
	const info = getAppInfo();

	return (
		<DialogCard
			{...props}
			className="about-twine-dialog"
			fixedSize
			headerLabel={t('dialogs.aboutTwine.title')}
		>
			<div className="content">
				<p className="about-twine-version">
					{t('dialogs.aboutTwine.versionLine', {version: info.version})}
				</p>
				<p>{t('dialogs.aboutTwine.forkSpecialized')}</p>
				<p>{t('dialogs.aboutTwine.forkDevelopedBy')}</p>
				<p
					dangerouslySetInnerHTML={{
						__html: t('dialogs.aboutTwine.license')
					}}
				/>
				<h3 className="about-twine-original-credits-header">
					{t('dialogs.aboutTwine.originalCreditsHeader')}
				</h3>
				<p>{t('dialogs.aboutTwine.originalCreditsLead')}</p>
				<div className="credits">
					<div className="code">
						<h3>{t('dialogs.aboutTwine.codeHeader')}</h3>
						<ul>
							{credits.code.map(c => (
								<li key={c}>{c}</li>
							))}
						</ul>
					</div>
					<div className="localizations">
						<h3>{t('dialogs.aboutTwine.localizationHeader')}</h3>
						<ul>
							{credits.localizations.map(c => (
								<li key={c}>{c}</li>
							))}
						</ul>
					</div>
				</div>
				<ButtonBar>
					<IconLink
						href={SOURCE_REPOSITORY_URL}
						icon={<IconCode />}
						label={t('dialogs.aboutTwine.codeRepo')}
						variant="primary"
					/>
				</ButtonBar>
			</div>
		</DialogCard>
	);
};
