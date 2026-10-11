import {Outlet} from "@tanstack/react-router";
import {OnboardingProvider} from "@/components/onboarding/onboarding-context";
import {TourOverlay} from "@/components/onboarding/tour-overlay";
import {WelcomeModal} from "@/components/onboarding/welcome-modal";
import {AppHeader} from "./app-header";
import {AppSidebar} from "./app-sidebar";
import {HeaderActionProvider} from "./header-action";
import {PageTitleProvider} from "./page-title";

/**
 * Authenticated app frame: the 276px sidebar, the 64px header, and the page content.
 * Auth pages stay outside this layout; every section under `/_app` renders inside it.
 */
export function AppShell() {
  return (
    <OnboardingProvider>
      <PageTitleProvider>
        <HeaderActionProvider>
          <div className="flex min-h-screen bg-white">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <AppHeader />
              <main className="flex-1 px-8 py-8">
                <Outlet />
              </main>
            </div>
          </div>
        </HeaderActionProvider>
      </PageTitleProvider>
      <WelcomeModal />
      <TourOverlay />
    </OnboardingProvider>
  );
}
