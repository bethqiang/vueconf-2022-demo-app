describe('ImageList', () => {
  describe('before data has loaded', () => {
    it('renders a loading indicator', () => {});
  });

  describe('when data has been loaded successfully', () => {
    it('renders a header', () => {});

    describe('table', () => {
      it('renders a header row', () => {});
  
      describe('table row', () => {
        it('renders one for each dog returned from the API', () => {});
        it('renders an image', () => {});
        it('renders the breed', () => {});
        
        describe('when clicked', () => {
          it('goes to the details page', () => {});
        });
      });
    });
  
    describe('pagination', () => {
      it('renders', () => {});
  
      describe('when next page is clicked', () => {
        it('changes the URL to the next page', () => {});
        it('calls the API to fetch the next page of data', () => {});
      });
  
      describe('when previous page is clicked', () => {
        it('changes the URL to the previous page', () => {});
        it('calls the API to fetch the previous page of data', () => {});
      });
    });
  });

  describe('when there was an error loading data', () => {
    it('renders an error alert', () => {});
  });
});
