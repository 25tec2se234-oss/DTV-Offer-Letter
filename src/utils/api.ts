const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getLocalData = (key: string, defaultValue: any) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setLocalData = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const mockApi = {
  get: async (url: string) => {
    await delay(500);
    if (url === '/' || url === '') {
      const offers = getLocalData('dtv_offers', []);
      return { offers, total: offers.length, page: 1, limit: 1000 };
    }
    
    // GET /verify/:token
    if (url.startsWith('/verify/')) {
      const id = url.split('/')[2];
      const offers = getLocalData('dtv_offers', []);
      const offer = offers.find((o: any) => o.id === id || o.verification_token === id);
      if (!offer) return Promise.reject({ response: { status: 404 } });
      return offer;
    }

    // GET /:id
    const id = url.replace('/', '');
    const offers = getLocalData('dtv_offers', []);
    const offer = offers.find((o: any) => o.id === id);
    if (!offer) throw new Error('Not found');
    return offer;
  },

  post: async (url: string, data: any) => {
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

    // Candidate Portal Access
    if (url.startsWith('/access/')) {
      const id = url.split('/')[2];
      const offers = getLocalData('dtv_offers', []);
      const offer = offers.find((o: any) => o.id === id || o.verification_token === id);
      if (!offer) return Promise.reject({ response: { status: 404 } });
      
      if (offer.candidate_details?.email?.toLowerCase().trim() !== data.email?.toLowerCase().trim()) {
        return Promise.reject({ response: { status: 401 } });
      }
      return offer;
    }

    // Accept / Decline action
    if (url.startsWith('/verify/')) {
      const parts = url.split('/');
      const id = parts[2];
      const action = parts[3];
      const offers = getLocalData('dtv_offers', []);
      const index = offers.findIndex((o: any) => o.id === id || o.verification_token === id);
      
      if (index > -1) {
        if (action === 'accept') {
          offers[index].status = 'ACCEPTED';
          offers[index].candidate_signature = data.signature;
        } else if (action === 'decline') {
          offers[index].status = 'DECLINED';
          offers[index].decline_reason = data.reason;
        }
        setLocalData('dtv_offers', offers);
        return { message: `Offer ${action}ed successfully` };
      }
      return Promise.reject({ response: { status: 404 } });
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

  put: async (url: string, data: any) => {
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

  delete: async (url: string) => {
    await delay(500);
    const id = url.replace('/', '');
    const offers = getLocalData('dtv_offers', []);
    const filtered = offers.filter((o: any) => o.id !== id);
    setLocalData('dtv_offers', filtered);
    return { success: true };
  }
};

export default mockApi;
