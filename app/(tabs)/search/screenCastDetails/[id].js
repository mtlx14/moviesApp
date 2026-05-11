import { DataProviderLists } from '../../../../src/contextLists';
import CastDetails from '../../../../src/pages/CastDetails';

export default function ScreenCastDetails() {
  return (
    <>
      <DataProviderLists listNames={['watched', 'playlist', 'library', 'discard', 'tv_watched', 'tv_library', 'tv_playlist']}>
        <CastDetails />
      </DataProviderLists>
    </>
  );
}
