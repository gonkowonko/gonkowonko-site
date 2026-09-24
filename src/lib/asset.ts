// Prefix public/ paths with the deploy base so the site works both at a domain root
// and under a sub-path (e.g. the github.io preview at /gonkowonko-site/).
export const asset = (p: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
