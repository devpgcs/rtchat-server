import { SetMetadata } from '@nestjs/common';

/**
 * The key to extract the `is-public` metadata from a guard
 */
export const IS_PUBLIC_KEY = 'is-public';

/**
 * Decorator to set the metadata of a route as public
 * @returns {ReturnType<typeof SetMetadata>} The metadata of the route as public
 */
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
