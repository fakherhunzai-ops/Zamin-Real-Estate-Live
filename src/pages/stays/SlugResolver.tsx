import { useParams } from 'react-router-dom';
import { useDestination } from '@/hooks/useStay';
import DestinationPage from './destination/page';
import StayDetailPage from './detail/page';
import StaysLoadingScreen from './components/StaysLoadingScreen';

/**
 * Single entry route for `/stays/:slug`.
 * A one-segment slug can be either a destination (Hunza, Skardu, …) or an
 * individual stay (mountain-view-villa-karimabad-hunza). Destinations win,
 * then we fall through to a stay detail page.
 */
export default function StaySlugResolver() {
  const { slug } = useParams();
  const { destination, loading } = useDestination(slug);

  if (loading) return <StaysLoadingScreen label="Finding this page…" />;
  if (destination) return <DestinationPage slug={slug as string} />;
  return <StayDetailPage slug={slug as string} />;
}