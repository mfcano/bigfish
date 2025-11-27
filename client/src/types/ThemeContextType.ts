export interface ThemeContextType {
  currentTheme: string;
  setTheme: (theme: string) => void,
  getNavClass: (tabId: string, currentId: string) => string,
  getNavButtonClass: () => string,
  getLogoClass: () => string,
  getTitleClass: () => string,
  getTimeClass: () => string,
  getCardClass: () => string,
  getButtonClass: () => string,
  getTextClass: () => string,
  getSubTextClass: () => string,
  getBadgeClass: (paid: any) => string,
  getStatusColor: (status: string) => string,
  getRoleBadgeClass: (filled: any, need: any) => string,
  getBodyClass: () => string,
  mvpLayout: string;
  setMvpLayout: (layout: string) => void;
}