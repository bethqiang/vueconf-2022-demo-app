import '@testing-library/jest-dom';
import { render } from '@/utils';
import { createTestingPinia } from '@pinia/testing';
// import userEvent from '@testing-library/user-event';
import ImageDetails from '../ImageDetails.vue';
import { imagesApi } from '@/api';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: 'HJ7Pzg5EQ' }
  }),
}));

const store = createTestingPinia({
  initialState: {
    favorites: [],
    votes: []
  }
});

const mockReturn = {
  data: {
    id: 'HJ7Pzg5EQ',
    url: 'https://cdn2.thedogapi.com/images/HJ7Pzg5EQ_1280.jpg',
    breeds: [{ name: 'Golden Retriever' }]
  }
};

const renderComponent = (options = {}) => render(ImageDetails, { global: { plugins: [store] }, ...options });

describe('ImageDetails', () => {

  beforeEach(() => {
    vi.spyOn(imagesApi, 'findById').mockResolvedValue(mockReturn);
  });

  it('renders a heading with the image ID', async () => {
    const { findByRole } = renderComponent();
    const heading = await findByRole('heading', { name: `Image ${mockReturn.data.id}` });
    expect(heading).toBeInTheDocument();
  });

  it('renders the image', async () => {
    const { findByRole } = renderComponent();
    const image = await findByRole('img');
    expect(image).toHaveAttribute('src', mockReturn.data.url);
  });

  it('renders the breeds', async () => {
    const { findByText } = renderComponent();
    const breedsText = await findByText('Golden Retriever');
    expect(breedsText).toBeInTheDocument;
  });

  describe('favorite section', () => {

    it('renders a favorite button', async() => {
      const { findByRole } = renderComponent();
      const favoriteButton = await findByRole('button', { name: 'Favorite' });
      expect(favoriteButton).toBeInTheDocument();
    });
  
    it('renders a delete favorite button', async () => {
      const { findByRole } = renderComponent();
      const deleteFavoriteButton = await findByRole('button', { name: 'Delete Favorite' });
      expect(deleteFavoriteButton).toBeInTheDocument();
    });

    describe('if the image hasn\'t been favorited', () => {

      it('should show \'Not Favorited\'', async () => {
        const { findByText } = renderComponent();
        const notFavoritedText = await findByText('Not Favorited');
        expect(notFavoritedText).toBeInTheDocument();
      });

      it('favorite button should not be red', async () => {
        const { findByRole } = renderComponent();
        const favoriteButton = await findByRole('button', { name: 'Favorite' });
        expect(favoriteButton).not.toHaveClass('text-error');
      });

      it('delete favorite button should be disabled', async () => {
        const { findByRole } = renderComponent();
        const deleteFavoriteButton = await findByRole('button', { name: 'Delete Favorite' });
        expect(deleteFavoriteButton).toBeDisabled();
      });

    });

  });
});
