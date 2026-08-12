const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getLocalData = (key: string, defaultValue: any) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setLocalData = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const mockApi = {
  get: async (url: string, config?: any) => {
    await delay(500);
    if (url === '/' || url === '') {
      const offers = getLocalData('dtv_offers', []);
      return { offers, total: offers.length, page: 1, limit: 1000 };
    }
    
    // GET /:id
    const id = url.replace('/', '');
    const offers = getLocalData('dtv_offers', []);
    const offer = offers.find((o: any) => o.id === id);
    if (!offer) throw new Error('Not found');
    return offer;
  },

  post: async (url: string, data: any, config?: any) => {
    await delay(600);
    
    // Send email route
    if (url.endsWith('/send')) {
      const id = url.split('/')[1];
      const offers = getLocalData('dtv_offers', []);
      const index = offers.findIndex((o: any) => o.id === id);
      if (index > -1) {
        offers[index].status = 'SENT';
        setLocalData('dtv_offers', offers);
        return { message: 'Offer sent successfully' };
      }
      throw new Error('Not found');
    }

    // POST /
    const offers = getLocalData('dtv_offers', []);
    const newOffer = { 
      ...data, 
      id: Date.now().toString(), 
      offer_id: `DTV-OFR-${Math.floor(Math.random() * 10000)}`,
      status: 'DRAFT',
      created_at: new Date().toISOString() 
    };
    offers.unshift(newOffer);
    setLocalData('dtv_offers', offers);
    return newOffer;
  },

  put: async (url: string, data: any, config?: any) => {
    await delay(600);
    const id = url.replace('/', '');
    const offers = getLocalData('dtv_offers', []);
    const index = offers.findIndex((o: any) => o.id === id);
    
    if (index > -1) {
      offers[index] = { ...offers[index], ...data, updated_at: new Date().toISOString() };
      setLocalData('dtv_offers', offers);
      return offers[index];
    }
    throw new Error('Not found');
  },

  delete: async (url: string, config?: any) => {
    await delay(500);
    const id = url.replace('/', '');
    const offers = getLocalData('dtv_offers', []);
    const filtered = offers.filter((o: any) => o.id !== id);
    setLocalData('dtv_offers', filtered);
    return { success: true };
  }
};

export default mockApi;
