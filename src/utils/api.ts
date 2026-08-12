import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const api = {
  get: async (url: string) => {
    if (url === '/' || url === '') {
      const q = query(collection(db, 'offers'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const offers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { offers, total: offers.length, page: 1, limit: 1000 };
    }
    
    // GET /verify/:token
    if (url.startsWith('/verify/')) {
      const id = url.split('/')[2];
      try {
        const docRef = doc(db, 'offers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
      } catch (e) {}
      
      // Check verification_token if id didn't match doc id
      const q = query(collection(db, 'offers'), where('verification_token', '==', id));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
      return Promise.reject({ response: { status: 404 } });
    }

    // GET /:id
    const id = url.replace('/', '');
    const docRef = doc(db, 'offers', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Not found');
    return { id: docSnap.id, ...docSnap.data() };
  },

  post: async (url: string, data: any) => {
    // Send email route
    if (url.endsWith('/send')) {
      const id = url.split('/')[1];
      const docRef = doc(db, 'offers', id);
      await updateDoc(docRef, { status: 'SENT' });
      return { message: 'Offer sent successfully' };
    }

    // Candidate Portal Access
    if (url.startsWith('/access/')) {
      const id = url.split('/')[2];
      
      let offerData: any = null;
      
      try {
        const docRef = doc(db, 'offers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          offerData = { id: docSnap.id, ...docSnap.data() };
        }
      } catch (e) {}
      
      if (!offerData) {
        const q = query(collection(db, 'offers'), where('verification_token', '==', id));
        const snap = await getDocs(q);
        if (!snap.empty) {
          offerData = { id: snap.docs[0].id, ...snap.docs[0].data() };
        }
      }
      
      if (!offerData) return Promise.reject({ response: { status: 404 } });
      
      if (offerData.candidate_details?.email?.toLowerCase().trim() !== data.email?.toLowerCase().trim()) {
        return Promise.reject({ response: { status: 401 } });
      }
      return offerData;
    }

    // Accept / Decline action
    if (url.startsWith('/verify/')) {
      const parts = url.split('/');
      const id = parts[2];
      const action = parts[3];
      
      let docRef = doc(db, 'offers', id);
      let offerData: any = null;
      
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) offerData = docSnap.data();
      } catch (e) {}
      
      if (!offerData) {
        const q = query(collection(db, 'offers'), where('verification_token', '==', id));
        const snap = await getDocs(q);
        if (!snap.empty) {
          docRef = doc(db, 'offers', snap.docs[0].id);
          offerData = snap.docs[0].data();
        }
      }
      
      if (offerData) {
        if (action === 'accept') {
          await updateDoc(docRef, { 
            status: 'ACCEPTED', 
            candidate_signature: data.signature 
          });
        } else if (action === 'decline') {
          await updateDoc(docRef, { 
            status: 'DECLINED', 
            decline_reason: data.reason 
          });
        }
        return { message: `Offer ${action}ed successfully` };
      }
      return Promise.reject({ response: { status: 404 } });
    }

    // POST /
    const newOffer = { 
      ...data, 
      offer_id: `DTV-OFR-${Math.floor(Math.random() * 10000)}`,
      status: 'DRAFT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const cleanData = JSON.parse(JSON.stringify(newOffer));
    const docRef = await addDoc(collection(db, 'offers'), cleanData);
    return { id: docRef.id, ...newOffer };
  },

  put: async (url: string, data: any) => {
    const id = url.replace('/', '');
    const docRef = doc(db, 'offers', id);
    const updateData = { ...data, updated_at: new Date().toISOString() };
    
    if (updateData.id) delete updateData.id;
    
    const cleanData = JSON.parse(JSON.stringify(updateData));
    await updateDoc(docRef, cleanData);
    return { id, ...data, updated_at: updateData.updated_at };
  },

  delete: async (url: string) => {
    const id = url.replace('/', '');
    const docRef = doc(db, 'offers', id);
    await deleteDoc(docRef);
    return { success: true };
  }
};

export default api;
