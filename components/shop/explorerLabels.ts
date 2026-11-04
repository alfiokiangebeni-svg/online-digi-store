import type { Dictionary } from "@/lib/i18n";
import type { ExploreLabels } from "./ExplorerView";

/** Libellés de la liste filtrable (Explorer et pages catégorie). */
export function explorerLabels(dict: Dictionary): ExploreLabels {
  return {
    searchLabel: dict.search.label,
    searchPlaceholder: dict.search.placeholder,
    typeLabel: dict.explore.typeLabel,
    all: dict.explore.all,
    kinds: dict.product.kinds,
    priceLabel: dict.explore.priceLabel,
    price: dict.explore.price,
    sort: dict.explore.sort,
    sortButton: dict.explore.sortButton,
    count: dict.explore.count,
    none: dict.explore.none,
    reset: dict.explore.reset,
    parental: dict.explore.parental,
    free: dict.product.free,
    oldPrice: dict.product.oldPrice,
    rating: dict.product.rating,
  };
}
