import React, { createContext, useContext, useState } from 'react';
import { mockDocuments } from '../data/mockDocuments';
import { getExpiryStatus } from '../utils/dateStatus';

const DocumentContext = createContext();

export function useDocumentContext() {
  return useContext(DocumentContext);
}

export function DocumentProvider({ children }) {
  const [documents, setDocuments] = useState(mockDocuments);

  const addDocument = (document) => {
    const newId = `doc${String(Math.max(...documents.map(d => parseInt(d.id.replace('doc', '')) || 0)) + 1).padStart(3, '0')}`;
    
    const newDoc = {
      ...document,
      id: newId,
      status: 'Pending',
      uploadedAt: new Date().toISOString().split('T')[0],
      rejectionReason: null
    };
    
    setDocuments(prev => [...prev, newDoc]);
  };

  const updateDocument = (id, updatedFields) => {
    setDocuments(prev => 
      prev.map(d => d.id === id ? { ...d, ...updatedFields } : d)
    );
  };

  const verifyDocument = (id) => {
    updateDocument(id, { status: 'Verified', rejectionReason: null });
  };

  const rejectDocument = (id, reason) => {
    updateDocument(id, { status: 'Rejected', rejectionReason: reason });
  };

  const getDocumentsByEntity = (entityType, entityId) => {
    return documents.filter(d => d.entityType === entityType && d.entityId === entityId);
  };

  // Helper function to resolve the TRUE status of a document including expiry
  const getResolvedStatus = (doc) => {
    if (doc.status === 'Rejected') return 'Rejected';
    if (doc.status === 'Pending') {
      // Even if pending, it might be expired
      const expiryState = getExpiryStatus(doc.expiryDate);
      if (expiryState === 'Expired') return 'Expired';
      return 'Pending';
    }
    // If Verified, check expiry
    const expiryState = getExpiryStatus(doc.expiryDate);
    if (expiryState === 'Expired' || expiryState === 'Expiring Soon') {
      return expiryState;
    }
    return 'Verified';
  };

  const getComplianceAlerts = () => {
    return documents.map(doc => {
      const resolved = getResolvedStatus(doc);
      return { ...doc, resolvedStatus: resolved };
    }).filter(doc => ['Expired', 'Expiring Soon', 'Rejected', 'Pending'].includes(doc.resolvedStatus));
  };

  const getSummary = () => {
    const summary = {
      Total: documents.length,
      Verified: 0,
      Pending: 0,
      Rejected: 0,
      'Expiring Soon': 0,
      Expired: 0
    };

    documents.forEach(doc => {
      const resolved = getResolvedStatus(doc);
      summary[resolved] = (summary[resolved] || 0) + 1;
    });

    return summary;
  };

  return (
    <DocumentContext.Provider value={{ 
      documents, 
      addDocument, 
      updateDocument, 
      verifyDocument, 
      rejectDocument,
      getDocumentsByEntity,
      getComplianceAlerts,
      getResolvedStatus,
      getSummary
    }}>
      {children}
    </DocumentContext.Provider>
  );
}
