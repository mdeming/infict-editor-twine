import {IconAward, IconSettings} from '@tabler/icons';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {ButtonBar} from '../components/container/button-bar';
import {IconButton} from '../components/control/icon-button';
import {AboutTwineDialog, AppPrefsDialog, useDialogsContext} from '../dialogs';

export const AppActions: React.FC = () => {
	const {dispatch} = useDialogsContext();
	const {t} = useTranslation();

	return (
		<ButtonBar>
			<IconButton
				icon={<IconSettings />}
				label={t('routeActions.app.preferences')}
				onClick={() => dispatch({type: 'addDialog', component: AppPrefsDialog})}
			/>
			<IconButton
				icon={<IconAward />}
				label={t('routeActions.app.aboutApp')}
				onClick={() =>
					dispatch({type: 'addDialog', component: AboutTwineDialog})
				}
			/>
		</ButtonBar>
	);
};
