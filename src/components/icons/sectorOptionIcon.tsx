import type { ReactNode } from "react";
import {
  SectorIconDistributor,
  SectorIconFoodservice,
  SectorIconImporter,
  SectorIconIndustry,
  SectorIconOther,
  SectorIconRetail,
} from "./FormSectorIcons";

export function sectorOptionIcon(optionId: string): ReactNode {
  switch (optionId) {
    case "sector_importador":
      return <SectorIconImporter />;
    case "sector_distribuidor":
      return <SectorIconDistributor />;
    case "sector_varejo_supermercado":
      return <SectorIconRetail />;
    case "sector_foodservice_restaurante":
      return <SectorIconFoodservice />;
    case "sector_industria":
      return <SectorIconIndustry />;
    case "sector_outro":
      return <SectorIconOther />;
    default:
      return <SectorIconOther />;
  }
}
