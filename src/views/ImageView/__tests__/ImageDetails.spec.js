import '@testing-library/jest-dom';
import { render } from '@/utils';
import { createTestingPinia } from '@pinia/testing';
import userEvent from '@testing-library/user-event';
import ImageDetails from '../ImageDetails.vue';
import { imagesApi, favoritesApi, votesApi } from '@/api';
import useFavoritesStore from '@/stores/favorites';
import useVotesStore from '@/stores/votes';

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

const mockImageReturn = {
  data: {
    id: 'HJ7Pzg5EQ',
    url: 'https://cdn2.thedogapi.com/images/HJ7Pzg5EQ_1280.jpg',
    breeds: [{ name: 'Golden Retriever' }]
  }
};

const mockFavoritesReturn = [{
  id: 41298,
  user_id: 'i8sceq',
  image_id: 'HJ7Pzg5EQ',
  sub_id: null,
  created_at: '2022-06-06T15:36:05.000Z',
  image: {
      id: 'HJ7Pzg5EQ',
      url: 'https://cdn2.thedogapi.com/images/HJ7Pzg5EQ.jpg'
  }
}];

const mockVotesUpvoteReturn = [{
    id: 100517,
    image_id: 'HJ7Pzg5EQ',
    sub_id: null,
    created_at: '2022-06-06T15:39:34.000Z',
    value: 1,
    country_code: 'US'
}];

const mockVotesDownvoteReturn = [{
  id: 100517,
  image_id: 'HJ7Pzg5EQ',
  sub_id: null,
  created_at: '2022-06-06T15:39:34.000Z',
  value: 0,
  country_code: 'US'
}];

const renderComponent = (options = {}) => render(ImageDetails, { global: { plugins: [store] }, ...options });

describe('ImageDetails', () => {

  beforeEach(() => {
    vi.spyOn(imagesApi, 'findById').mockResolvedValue(mockImageReturn);
  });

  describe('before data has loaded', () => {

    it('renders a loading indicator', () => {
      const { getByTestId } = renderComponent();
      const loading = getByTestId('loading-indicator');
      expect(loading).toHaveAttribute('aria-busy', 'true');
    });

  });

  describe('when data has been loaded successfully', () => {

    it('renders a heading with the image ID', async () => {
      const { findByRole } = renderComponent();
      const heading = await findByRole('heading', { name: `Image ${mockImageReturn.data.id}` });
      expect(heading).toBeInTheDocument();
    });
  
    it('renders the image', async () => {
      const { findByRole } = renderComponent();
      const image = await findByRole('img');
      expect(image).toHaveAttribute('src', mockImageReturn.data.url);
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
          expect(favoriteButton).not.toHaveClass('!border-coral-700 !bg-coral-700');
        });
  
        it('delete favorite button should be disabled', async () => {
          const { findByRole } = renderComponent();
          const deleteFavoriteButton = await findByRole('button', { name: 'Delete Favorite' });
          expect(deleteFavoriteButton).toBeDisabled();
        });

        describe('clicking the favorite button', () => {

          it('should call the API to favorite the image', async () => {
            vi.spyOn(favoritesApi, 'favorite').mockResolvedValue({ success: true });
            vi.spyOn(favoritesApi, 'findAll').mockResolvedValue(mockFavoritesReturn);

            const { findByRole } = renderComponent();
            const favoriteButton = await findByRole('button', { name: 'Favorite' });
            await userEvent.click(favoriteButton);
            expect(favoritesApi.favorite).toHaveBeenCalledWith({ image_id: mockImageReturn.data.id });
          });

        });
  
      });

      describe('if the image has been favorited', () => {

        beforeEach(() => {
          const favoritesStore = useFavoritesStore();
          favoritesStore.favorites = mockFavoritesReturn;
        });

        it('should show \'Favorited\'', async () => {
          const { findByText } = renderComponent();
          const favoritedText = await findByText('Favorited');
          expect(favoritedText).toBeInTheDocument();
        });

        it('favorite button should be red', async () => {
          const { findByRole } = renderComponent();
          const favoriteButton = await findByRole('button', { name: 'Favorite' });
          expect(favoriteButton).toHaveClass('!border-coral-700 !bg-coral-700');
        });

        it('delete favorite button should be enabled', async () => {
          const { findByRole } = renderComponent();
          const deleteFavoriteButton = await findByRole('button', { name: 'Delete Favorite' });
          expect(deleteFavoriteButton).not.toBeDisabled();
        });
  
        describe('clicking the delete button', () => {

          it('should call the API to delete the favorite', async () => {
            vi.spyOn(favoritesApi, 'delete').mockResolvedValue({ success: true });
            vi.spyOn(favoritesApi, 'findAll').mockResolvedValue([]);

            const { findByRole } = renderComponent();
            const deleteFavoriteButton = await findByRole('button', { name: 'Delete Favorite' });
            await userEvent.click(deleteFavoriteButton);
            expect(favoritesApi.delete).toHaveBeenCalledWith(mockFavoritesReturn[0].id);
          });

        });

      });
  
    });

    describe('vote section', () => {

      it('renders upvote and downvote buttons', async () => {
        const { findByRole } = renderComponent();
        const upvoteButton = await findByRole('button', { name: 'Upvote' });
        expect(upvoteButton).toBeInTheDocument();
        const downvoteButton = await findByRole('button', { name: 'Downvote' });
        expect(downvoteButton).toBeInTheDocument();
      });
  
      describe('if the image hasn\'t been voted on', () => {

        it('should show \'Not Voted\'', async () => {
          const { findByText } = renderComponent();
          const breedsText = await findByText('Not Voted');
          expect(breedsText).toBeInTheDocument;
        });

        it('upvote button should not be green', async () => {
          const { findByRole } = renderComponent();
          const upvoteButton = await findByRole('button', { name: 'Upvote' });
          expect(upvoteButton).not.toHaveClass('!border-mint-700 !bg-mint-700');
        });

        it('downvote button should not be red', async () => {
          const { findByRole } = renderComponent();
          const downvoteButton = await findByRole('button', { name: 'Downvote' });
          expect(downvoteButton).not.toHaveClass('!border-lemon-700 !bg-lemon-700');
        });

      });
  
      describe('if the image has been upvoted', () => {

        beforeEach(() => {
          const votesStore = useVotesStore();
          votesStore.votes = mockVotesUpvoteReturn;
        });

        it('should show \'Upvoted\'', async () => {
          const { findByText } = renderComponent();
          const breedsText = await findByText('Upvoted');
          expect(breedsText).toBeInTheDocument;
        });

        it('upvote button should be green', async () => {
          const { findByRole } = renderComponent();
          const upvoteButton = await findByRole('button', { name: 'Upvote' });
          expect(upvoteButton).toHaveClass('!border-mint-700 !bg-mint-700');
        });

      });
  
      describe('if the image has been downvoted', () => {

        beforeEach(() => {
          const votesStore = useVotesStore();
          votesStore.votes = mockVotesDownvoteReturn;
        });

        it('should show \'Downvoted\'', async () => {
          const { findByText } = renderComponent();
          const breedsText = await findByText('Downvoted');
          expect(breedsText).toBeInTheDocument;
        });

        it('downvote button should be yellow', async () => {
          const { findByRole } = renderComponent();
          const downvoteButton = await findByRole('button', { name: 'Downvote' });
          expect(downvoteButton).toHaveClass('!border-lemon-700 !bg-lemon-700');
        });

      });
  
      describe('clicking the upvote button', () => {

        it('should call the API to upvote the image', async () => {
          vi.spyOn(votesApi, 'vote').mockResolvedValue({ success: true });
          vi.spyOn(votesApi, 'findAll').mockResolvedValue(mockVotesUpvoteReturn);

            const { findByRole } = renderComponent();
            const upvoteButton = await findByRole('button', { name: 'Upvote' });
            await userEvent.click(upvoteButton);
            expect(votesApi.vote).toHaveBeenCalledWith({ image_id: mockImageReturn.data.id, value: 1 });
        });

      });
  
      describe('clicking the downvote button', () => {

        it('should call the API to downvote the image', async () => {
          vi.spyOn(votesApi, 'vote').mockResolvedValue({ success: true });
          vi.spyOn(votesApi, 'findAll').mockResolvedValue(mockVotesUpvoteReturn);

            const { findByRole } = renderComponent();
            const downvoteButton = await findByRole('button', { name: 'Downvote' });
            await userEvent.click(downvoteButton);
            expect(votesApi.vote).toHaveBeenCalledWith({ image_id: mockImageReturn.data.id, value: 0 });
        });

      });

    });

  });

});
