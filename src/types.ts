export interface Scenario {
  id: string;
  name: string;
  options: string[];
}

export const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: 'breakfast',
    name: 'Breakfast Choice',
    options: ['Bacon', 'Butter Sandwich', 'Avocado Sandwich', 'Cereal']
  },
  {
    id: 'activities',
    name: 'Family Activities',
    options: ['Board Game', 'Movie Night', 'Park Visit', 'Arts & Crafts']
  },
  {
    id: 'restaurants',
    name: 'Restaurant Choice',
    options: ['Pizza Place', 'Burger Joint', 'Chinese Food', 'Mexican Food']
  }
];