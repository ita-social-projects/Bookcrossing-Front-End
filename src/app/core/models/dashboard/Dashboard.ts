
import {ILocationData} from './LocationData';
import {IBookUserComparisonData} from './BookUserComparisonData';

export interface IDashboard {
  cities: string[];
  locationData: ILocationData;
  bookUserComparisonData?: IBookUserComparisonData;
  availabilityData?: any;
}
