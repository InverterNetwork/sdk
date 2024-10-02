import { pipe, subscribe } from 'wonka'
import { client } from '..' // Your urql client configuration
import type { TypedDocumentNode } from '@urql/core'

type CallbackId = string

/**
 * Type for the subscription callback function.
 * @template T - The expected shape of the subscription data.
 */
type SubscriptionCallback<T> = (data: { [key: string]: T[] }) => void

/**
 * SubscriptionManager manages GraphQL subscriptions with URQL,
 * allows dynamic addition/removal of callbacks, and auto-handles subscriptions.
 *
 * @template T - The shape of the data returned by the subscription.
 */
class SubscriptionManager<T> {
  private callbacks: Map<CallbackId, SubscriptionCallback<T>> = new Map()
  private subscriptionDocument: TypedDocumentNode<{ [key: string]: T[] }, any>
  private subscriptionOperation: (() => void) | null = null
  private isSubscribed = false

  constructor(
    subscriptionDocument: TypedDocumentNode<{ [key: string]: T[] }, any>
  ) {
    this.subscriptionDocument = subscriptionDocument
  }

  /**
   * Add a new callback for the subscription data.
   * Starts the subscription if this is the first callback.
   * @param callback - Function to handle subscription events.
   * @returns CallbackId - A unique ID for the callback.
   */
  public addCallback(callback: SubscriptionCallback<T>): CallbackId {
    const id = this.generateCallbackId()
    this.callbacks.set(id, callback)

    // If no previous subscription, start listening
    if (!this.isSubscribed) {
      this.startSubscription()
    }

    return id
  }

  /**
   * Remove an existing callback using its unique ID.
   * Stops the subscription if no callbacks are left.
   * @param id - Unique callback ID to remove.
   */
  public removeCallback(id: CallbackId) {
    this.callbacks.delete(id)

    // Stop subscription if no callbacks remain
    if (this.callbacks.size === 0) {
      this.stopSubscription()
    }
  }

  /**
   * Start the GraphQL subscription using URQL's client.
   * Triggers registered callbacks when new data is received.
   */
  private startSubscription() {
    console.log('Starting subscription...')
    this.isSubscribed = true

    // Use urql's subscription API
    const { unsubscribe } = pipe(
      client.subscription(this.subscriptionDocument, {}),
      subscribe((result) => {
        if (result.data) {
          // Assume the subscription response has the expected shape { [key: string]: T[] }
          this.triggerCallbacks(result.data) // For simplicity, we assume the first item
        }
      })
    )

    // Store the unsubscribe function to stop later
    this.subscriptionOperation = unsubscribe
  }

  /**
   * Stop the GraphQL subscription.
   * Unsubscribes from URQL's subscription stream.
   */
  private stopSubscription() {
    console.log('Stopping subscription...')
    if (this.subscriptionOperation) {
      this.subscriptionOperation()
      this.isSubscribed = false
    }
  }

  /**
   * Trigger all registered callbacks with the new subscription data.
   * @param data - The new data received from the subscription.
   */
  private triggerCallbacks(data: { [key: string]: T[] }) {
    this.callbacks.forEach((callback) => callback(data))
  }

  /**
   * Generate a unique ID for the callback using UUID.
   * @returns CallbackId - The generated unique callback ID.
   */
  private generateCallbackId(): CallbackId {
    return crypto?.randomUUID?.() ?? Math.random().toString(36).substring(2)
  }
}

export default SubscriptionManager
