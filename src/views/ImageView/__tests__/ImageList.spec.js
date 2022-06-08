import '@testing-library/jest-dom';
import { render } from '@/utils';
import { createTestingPinia } from '@pinia/testing';
import userEvent from '@testing-library/user-event';
import ImageList from '../ImageList.vue';
import { imagesApi } from '@/api';

const pushMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/images',
    query: {}
  }),
  useRouter: () => ({
    push: pushMock
  })
}));

const store = createTestingPinia({
  initialState: {
    favorites: [],
    votes: []
  }
});

const mockImagesReturn = {
  data: [{
    id: 'B1-llgq4m',
    url: 'https://cdn2.thedogapi.com/images/B1-llgq4m_1280.jpg',
    breeds: [{ name: 'Australian Shepherd' }]
  }, {
    id: 'HJ7Pzg5EQ',
    url: 'https://cdn2.thedogapi.com/images/HJ7Pzg5EQ_1280.jpg',
    breeds: [{ name: 'Golden Retriever' }]
  }, {
    id: 'AwKd_0wL4',
    url: 'https://cdn2.thedogapi.com/images/AwKd_0wL4.jpg'
  }],
  count: 3
};

const renderComponent = (options = {}) => render(ImageList, { global: { plugins: [store] }, ...options });

describe('ImageList', () => {

  describe('before data has loaded', () => {

    beforeEach(() => {
      vi.spyOn(imagesApi, 'findAll').mockResolvedValue(mockImagesReturn);
    });

    it('renders a loading indicator', () => {
      const { getByTestId } = renderComponent();
      const loading = getByTestId('loading-indicator');
      expect(loading).toHaveAttribute('aria-busy', 'true');
    });

  });

  describe('when data has been loaded successfully', () => {
  
    describe('table row', () => {

      beforeEach(() => {
        vi.spyOn(imagesApi, 'findAll').mockResolvedValue(mockImagesReturn);
      });

      it('renders one for each dog returned from the API and the header row', async () => {
        const { findAllByRole } = renderComponent();
        const rows = await findAllByRole('row');
        expect(rows.length).toEqual(mockImagesReturn.data.length + 1);
      });

      // it('renders an image', () => {});

      // describe('if there are breeds', () => {
      //   it('renders the breeds', () => {});
      // });
  
      // describe('if there are no breeds', () => {
      //   it('renders \'Unknown\'', () => {});
      // });
      
      describe('when clicked', () => {

        it('goes to the details page', async () => {
          const { findByTestId } = renderComponent();
          const row = await findByTestId(`row-${mockImagesReturn.data[0].id}`);
          await userEvent.click(row);
          expect(pushMock).toHaveBeenLastCalledWith(`/images/${mockImagesReturn.data[0].id}`);
        });

      });

    });
  
    describe('pagination', () => {

      const mockReturn = {
        data: Array.from({ length: 11 }).map(() => mockImagesReturn.data[0]),
        count: 11
      };

      // it('renders', () => {});
  
      describe('when next page is clicked', () => {

        beforeEach(async () => {
          vi.spyOn(imagesApi, 'findAll').mockResolvedValue(mockReturn);
        });

        it('changes the URL to the next page', async () => {
          const { findByRole } = renderComponent();
          const nextButton = await findByRole('button', { name: 'Go to next page' });
          await userEvent.click(nextButton);
          expect(pushMock).toHaveBeenLastCalledWith('/images?page=2');
        });

        it('calls the API to fetch the next page of data', async () => {
          const { findByRole } = renderComponent();
          const nextButton = await findByRole('button', { name: 'Go to next page' });
          await userEvent.click(nextButton);
          // API is zero-based, so need to subtract one from the page
          expect(imagesApi.findAll).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 }));
        });

      });
  
      describe('when previous page is clicked', () => {

        it('changes the URL to the previous page', async () => {
          const { findByRole } = renderComponent();
          const nextButton = await findByRole('button', { name: 'Go to next page' });
          await userEvent.click(nextButton);
          const previousButton = await findByRole('button', { name: 'Go to previous page' });
          await userEvent.click(previousButton);
          expect(pushMock).toHaveBeenLastCalledWith('/images');
        });

        it('calls the API to fetch the previous page of data', async () => {
          const { findByRole } = renderComponent();
          const nextButton = await findByRole('button', { name: 'Go to next page' });
          await userEvent.click(nextButton);
          const previousButton = await findByRole('button', { name: 'Go to previous page' });
          await userEvent.click(previousButton);
          // API is zero-based, so need to subtract one from the page
          expect(imagesApi.findAll).toHaveBeenLastCalledWith(expect.objectContaining({ page: 0 }));
        });

      });

    });

  });

  // describe('when there was an error loading data', () => {
  //   it('renders an error alert', () => {});
  // });
});

