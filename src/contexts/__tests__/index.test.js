import * as Contexts from '../index';
import * as AuthContext from '../auth/AuthContext';

describe('contexts/index.js', () => {
  it('should re-export useAuth from AuthContext', () => {
    // Check that useAuth is re-exported
    expect(Contexts).toHaveProperty('useAuth');
    expect(Contexts.useAuth).toBe(AuthContext.useAuth);
  });

  it('should re-export AuthProvider from AuthContext', () => {
    // Check that AuthProvider is re-exported
    expect(Contexts).toHaveProperty('AuthProvider');
    expect(Contexts.AuthProvider).toBe(AuthContext.AuthProvider);
  });

  it('should not have any additional exports', () => {
    // Verify only the expected exports exist
    const expectedExports = ['useAuth', 'AuthProvider'];
    const actualExports = Object.keys(Contexts);
    
    // Check that all expected exports exist
    expectedExports.forEach(exportName => {
      expect(actualExports).toContain(exportName);
    });
    
    // Check that there are no unexpected exports
    expect(actualExports.sort()).toEqual(expectedExports.sort());
  });
});
