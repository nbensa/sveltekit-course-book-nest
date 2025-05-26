<script>
  import bookNestLogo from "$assets/app-logo.svg";
  import { Button } from "$components";
  import { getUserState } from "$lib/state/user-state.svelte";

  let userContext = getUserState();
  let { user, userName } = $derived(userContext);
</script>

<header>
  <a href={user ? "/private/dashboard" : "/"}>
    <img src={bookNestLogo} alt="Go to home" class="logo" />
  </a>
  <nav>
    <ul>
      {#if user}
        <li>
          {userName}
        </li>
        <li>
          <Button isMenu={true} onclick={() => userContext.logout()}
            >Logout</Button
          >
        </li>
      {:else}
        <li>
          <Button isMenu={true} href="/register">Create account</Button>
        </li>
        <li>
          <Button isMenu={true} isSecondary={true} href="/login">Login</Button>
        </li>
      {/if}
    </ul>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 4vw;
  }
  ul {
    display: flex;
    align-items: center;
    column-gap: 24px;
  }

  .logo {
    height: 72px;
  }
</style>
