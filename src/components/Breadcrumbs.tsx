import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";

export interface BreadCrumb {
  label: string;
  href: string;
  current?: boolean;
}

export function BreadCrumbs({
  crumbs,
  showHome,
}: {
  crumbs: BreadCrumb[];
  showHome?: boolean;
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol role="list" className="flex items-center space-x-4">
        {showHome && (
          <li>
            <div>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <HomeIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0"
                />
                <span className="sr-only">Home</span>
              </a>
              <ChevronRightIcon
                aria-hidden="true"
                className="h-5 w-5 flex-shrink-0 text-gray-400"
              />
            </div>
          </li>
        )}
        {crumbs.map(({ href, label, current = false }, i) => (
          <li key={label}>
            <div className="flex items-center">
              <ChevronRightIcon
                aria-hidden="true"
                className="h-5 w-5 flex-shrink-0 text-gray-400"
              />
              <a
                href={href}
                aria-current={current ? "page" : undefined}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                {label}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
