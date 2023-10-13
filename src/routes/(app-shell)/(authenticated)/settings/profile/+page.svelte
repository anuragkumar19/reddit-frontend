<!-- <script lang="ts">
	import { FileButton, getToastStore } from '@skeletonlabs/skeleton'
	import type { PageData } from './$types'
	import {
		updateNameSchema,
		updateUsernameSchema,
		type UpdateNameSchema,
		type UpdateUsernameSchema,
	} from '$lib/validations/zod'
	import { ZodError } from 'zod'
	import { invalidateAll } from '$app/navigation'

	export let data: PageData

	const toastStore = getToastStore()

	let name = data.auth.user.name
	let username = data.auth.user.username

	$: disabled = name === data.auth.user.name && username === data.auth.user.username

	async function handleSubmit() {
		let updates = 0

		if (name !== data.auth.user.name) {
			loading = true
			let data: UpdateNameSchema
			try {
				data = updateNameSchema.parse({ name })
			} catch (err) {
				if (err instanceof ZodError) {
					toastStore.trigger({
						message: err.errors[0].message,
						background: 'variant-filled-warning',
						autohide: true,
						timeout: 4000,
					})
				}
				loading = false
				return
			}

			try {
				await UserUpdateName(data)

				toastStore.trigger({
					message: 'Name updated',
					background: 'variant-filled-success',
					autohide: true,
					timeout: 4000,
				})
				updates++
			} catch (err) {
				toastStore.trigger({
					message: (err as any).response.data.message,
					background: 'variant-filled-warning',
					autohide: true,
					timeout: 4000,
				})
			} finally {
				loading = false
			}
		}

		if (username !== data.auth.user.username) {
			loading = true
			let data: UpdateUsernameSchema
			try {
				data = updateUsernameSchema.parse({ username })
			} catch (err) {
				if (err instanceof ZodError) {
					toastStore.trigger({
						message: err.errors[0].message,
						background: 'variant-filled-warning',
						autohide: true,
						timeout: 4000,
					})
				}
				loading = false
				return
			}

			try {
				await UserUpdateUsername(data)

				toastStore.trigger({
					message: 'Username updated',
					background: 'variant-filled-success',
					autohide: true,
					timeout: 4000,
				})
				updates++
			} catch (err) {
				toastStore.trigger({
					message: (err as any).response.data.message,
					background: 'variant-filled-warning',
					autohide: true,
					timeout: 4000,
				})
			} finally {
				loading = false
			}
		}

		if (updates > 0) {
			loading = true
			await invalidateAll()
			loading = false
		}
	}
</script>

<svelte:head>
	<title>Settings | Reddit</title>
</svelte:head>
<main class="flex justify-center">
	<div class="card w-full max-w-sm mt-8">
		<header class="card-header text-center">
			<h2 class="h2 mt-1">Settings</h2>
		</header>
		<section class="p-4">
			<form on:submit|preventDefault={handleSubmit}>
				<label class="label">
					<span>Name</span>
					<input
						class="input"
						type="text"
						placeholder="John Deo"
						autocomplete="name"
						bind:value={name}
						disabled={loading}
					/>
				</label>
				<label class="label">
					<span>Username</span>
					<input
						class="input"
						type="text"
						placeholder="john_deo"
						autocomplete="username"
						bind:value={username}
						disabled={loading}
					/>
				</label>
				<button
					disabled={loading || disabled}
					type="submit"
					class="btn variant-filled-primary my-2 w-full">Save</button
				>
				<FileButton
					disabled={loading}
					name="profile-avatar-update"
					button="btn variant-filled-secondary"
					width="w-full">Upload Avatar</FileButton
				>
			</form>
		</section>
	</div>
</main> -->
