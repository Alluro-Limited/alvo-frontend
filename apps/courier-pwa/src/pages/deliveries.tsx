import {Link} from "@tanstack/react-router";
import {ActiveDelivery} from "@/components/deliveries/active-delivery";
import {CompletedSection} from "@/components/deliveries/completed-section";
import {useDeliveries} from "@/components/deliveries/use-deliveries";
import {AcceptDialog} from "@/components/home/accept-dialog";
import {m} from "@/paraglide/messages";

/**
 * The Deliveries tab: milestone slot for the in-flight job, kind chips, and the
 * Completed Deliveries list. Rendered inside the `_tabs` layout (bottom nav stays).
 */
export function DeliveriesPage() {
  const deliveries = useDeliveries();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] leading-[30px] font-bold tracking-[-0.01em]">{m["nav.deliveries"]()}</h1>
        <Link to="/analytics" className="text-[13px] font-semibold text-primary-500">
          {m["deliveries.view_analytics"]()}
        </Link>
      </div>
      {deliveries.loading ? (
        <DeliveriesSkeleton />
      ) : (
        <>
          <div className="mt-6">
            <ActiveDelivery
              job={deliveries.active}
              pending={deliveries.mutating}
              onDecline={deliveries.declineJob}
              onAccept={deliveries.askAccept}
            />
          </div>
          <CompletedSection deliveries={deliveries.completed} filter={deliveries.filter} onFilter={deliveries.setFilter} />
        </>
      )}
      <AcceptDialog
        open={deliveries.confirming !== null}
        pending={deliveries.mutating}
        onConfirm={deliveries.confirmAccept}
        onClose={deliveries.closeConfirm}
      />
    </main>
  );
}

function DeliveriesSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="h-40 animate-pulse rounded-[14px] bg-grey-100" />
      <div className="h-[33px] w-56 animate-pulse rounded-[8px] bg-grey-100" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-[14px] bg-grey-100" />
      ))}
    </div>
  );
}
