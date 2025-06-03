/**
 * Listing Data Models
 * 
 * Type definitions for Etsy listings
 */

/**
 * Who made the item
 */
export enum WhoMade {
  I_DID = 'i_did',
  COLLECTIVE = 'collective',
  SOMEONE_ELSE = 'someone_else'
}

/**
 * When the item was made
 */
export enum WhenMade {
  MADE_TO_ORDER = 'made_to_order',
  MADE_2020_2025 = '2020_2025',
  MADE_2010_2019 = '2010_2019',
  MADE_2000_2009 = '2000_2009',
  MADE_1990S = '1990s',
  MADE_1980S = '1980s',
  MADE_1970S = '1970s',
  MADE_1960S = '1960s',
  MADE_1950S = '1950s',
  MADE_1940S = '1940s',
  MADE_1930S = '1930s',
  MADE_1920S = '1920s',
  MADE_1910S = '1910s',
  MADE_1900S = '1900s',
  MADE_1800S = '1800s',
  MADE_1700S = '1700s',
  MADE_BEFORE_1700 = 'before_1700'
}

/**
 * Data for creating a draft listing
 */
export interface DraftListingData {
  // Required fields
  title: string;
  description: string;
  price: number;
  quantity: number;
  who_made: WhoMade;
  when_made: WhenMade;
  is_supply: boolean;
  taxonomy_id: number;
  
  // Optional fields
  shipping_profile_id?: number;
  shop_section_id?: number;
  production_partner_ids?: number[];
  tags?: string[];
  styles?: string[];
  materials?: string[];
  processing_min?: number;
  processing_max?: number;
  type?: string;
}

/**
 * Listing image data
 */
export interface ListingImage {
  // Base64 encoded image or image URL
  image: string;
  rank?: number;
  overwrite?: boolean;
  alt_text?: string;
}

/**
 * Listing inventory item
 */
export interface ListingInventoryItem {
  sku?: string;
  property_values?: Array<{
    property_id: number;
    value_id: number;
    value_name?: string;
  }>;
  offerings: Array<{
    price: number;
    quantity: number;
    is_enabled?: boolean;
  }>;
}

/**
 * Listing property value
 */
export interface ListingPropertyValue {
  property_id: number;
  value_ids?: number[];
  values?: string[];
  scale_id?: number;
}

/**
 * Listing response data
 */
export interface ListingResponse {
  listing_id: number;
  user_id: number;
  shop_id: number;
  title: string;
  description: string;
  state: string;
  creation_timestamp: number;
  created_timestamp: number;
  ending_timestamp: number;
  original_creation_timestamp: number;
  last_modified_timestamp: number;
  state_timestamp: number;
  quantity: number;
  shop_section_id: number | null;
  featured_rank: number;
  url: string;
  num_favorers: number;
  non_taxable: boolean;
  is_taxable: boolean;
  is_customizable: boolean;
  is_personalizable: boolean;
  personalization_is_required: boolean;
  personalization_char_count_max: number | null;
  personalization_instructions: string | null;
  taxonomy_id: number;
  tags: string[];
  processing_min: number;
  processing_max: number;
  who_made: string;
  when_made: string;
  is_supply: boolean;
  production_partners: Array<{
    production_partner_id: number;
    partner_name: string;
    location: string;
  }>;
  has_variations: boolean;
  should_auto_renew: boolean;
  language: string;
  price: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
}
